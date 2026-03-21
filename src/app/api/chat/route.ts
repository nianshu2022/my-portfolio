import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 强制动态模式，防止静态缓存
export const dynamic = "force-dynamic";

// -----------------------------------------------
// 简单的内存速率限制（服务端）
// 每个 IP 每分钟最多 20 次请求
// -----------------------------------------------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 分钟

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return true;
    }

    if (record.count >= RATE_LIMIT_MAX) {
        return false;
    }

    record.count += 1;
    return true;
}

// 定期清理过期记录，防止内存泄漏
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
        if (now > value.resetAt) rateLimitMap.delete(key);
    }
}, 5 * 60 * 1000);

// 定义接口类型
interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

interface KnowledgeItem {
    content: string;
    source: string;
}

// 系统提示词模板
const SYSTEM_PROMPT = `你是一个基于个人博客内容的AI助手。你的名字叫"念舒AI助手"。

以下是与用户问题相关的博客内容片段（作为上下文）：
---
{context}
---

请遵循以下原则：
1. **优先基于上下文回答**：如果上下文包含答案，请主要依据上下文内容回答，不要凭空编造。
2. **坦诚未知**：如果上下文中没有相关信息，请明确告知用户"博客中暂时没有关于这个话题的内容"，不要用通用知识填充作答。
3. **风格亲切**：保持友好、自然但专业的语气，像朋友间对话一样。
4. **引用来源**：若引用了具体博客文章，请在回答末尾用括号注明来源文章标题。
5. **语言**：始终使用中文回答。
6. **简洁**：回答控制在 600 字以内，重点突出，避免冗余。

现在请回答用户的问题。`;

export async function POST(req: NextRequest) {
    // 速率限制检查
    const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown";

    if (!checkRateLimit(ip)) {
        return NextResponse.json(
            { error: "请求过于频繁，请稍后再试。" },
            { status: 429 }
        );
    }

    try {
        const body = await req.json();
        const { messages } = body;
        // 截取最近 10 条历史消息，防止 token 超限
        const MAX_HISTORY = 10;
        const rawHistory: ChatMessage[] = messages || [];
        const history = rawHistory.slice(-MAX_HISTORY);
        const lastMessage = history[history.length - 1];
        const userQuery = lastMessage.content;

        // 1. 简单的关键词检索 (RAG)
        // knowledge.json 存放在 data/ 目录，不对外公开
        const knowledgePath = path.join(process.cwd(), "data", "knowledge.json");
        let context = "";

        if (fs.existsSync(knowledgePath)) {
            try {
                const knowledgeData: KnowledgeItem[] = JSON.parse(
                    fs.readFileSync(knowledgePath, "utf-8")
                );

                // 简单的关键词评分
                const queryTerms = userQuery.toLowerCase().split(/[\s,，]+/);
                const rankedDocs = knowledgeData
                    .map((doc) => {
                        let score = 0;
                        const contentLower = doc.content.toLowerCase();
                        queryTerms.forEach((term) => {
                            if (term && contentLower.includes(term)) {
                                score += 1;
                            }
                        });
                        return { doc, score };
                    })
                    .filter((item) => item.score > 0)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3); // 取前3个最相关的片段

                if (rankedDocs.length > 0) {
                    context = rankedDocs
                        .map((item) => `[来源: ${item.doc.source}]\n${item.doc.content}`)
                        .join("\n\n");
                }
            } catch (e) {
                console.error("Failed to read knowledge base:", e);
            }
        }

        // 2. 构建最终提示词（使用字符串拼接避免二次替换问题）
        const contextText = context || "暂无相关上下文，请依靠你的通用知识回答。";
        const filledSystemPrompt = SYSTEM_PROMPT.replace("{context}", contextText);

        const finalMessages = [
            { role: "system", content: filledSystemPrompt },
            ...history,
        ];

        // 3. 调用 SiliconFlow API
        const apiKey = process.env.SILICONFLOW_API_KEY;
        // 使用仅服务端变量 AI_MODEL（无 NEXT_PUBLIC_ 前缀）
        const model = process.env.AI_MODEL || "Qwen/Qwen2.5-7B-Instruct";

        if (!apiKey) {
            return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
        }

        // 设置超时控制 (15秒)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
            const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model,
                    messages: finalMessages,
                    stream: true, // 开启流式传输
                    temperature: 0.7,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("SiliconFlow API Error:", response.status, errorText);
                return NextResponse.json(
                    { error: `API request failed: ${response.statusText}` },
                    { status: response.status }
                );
            }

            // 处理流式响应
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();

            const stream = new ReadableStream({
                async start(streamController) {
                    if (!response.body) {
                        streamController.close();
                        return;
                    }
                    const reader = response.body.getReader();

                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            const chunk = decoder.decode(value, { stream: true });
                            const lines = chunk.split("\n");

                            for (const line of lines) {
                                if (line.startsWith("data: ") && line !== "data: [DONE]") {
                                    try {
                                        const data = JSON.parse(line.slice(6));
                                        const content = data.choices[0]?.delta?.content || "";
                                        if (content) {
                                            streamController.enqueue(encoder.encode(content));
                                        }
                                    } catch {
                                        // 忽略不完整的 JSON chunk
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        console.error("Stream reading error:", err);
                        streamController.error(err);
                    } finally {
                        streamController.close();
                    }
                },
            });

            return new NextResponse(stream, {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                },
            });
        } catch (fetchError: unknown) {
            clearTimeout(timeoutId);
            if (fetchError instanceof Error && fetchError.name === "AbortError") {
                return NextResponse.json({ error: "Upstream API timeout" }, { status: 504 });
            }
            throw fetchError;
        }
    } catch (error: unknown) {
        console.error("Chat API Error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
