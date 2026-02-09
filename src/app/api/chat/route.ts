import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 强制动态模式，防止静态缓存
export const dynamic = "force-dynamic";

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
1. **优先基于上下文回答**：如果上下文包含答案，请主要依据上下文回答。
2. **坦诚未知**：如果上下文没有相关信息，且你无法根据通用知识回答，请直接告诉用户博客中暂时没有相关内容。
3. **风格亲切**：保持友好、专业但不过于拘谨的语气。
4. **引用来源**：如果引用了具体的博客文章，请在回答末尾指明来源文章标题（如果上下文提供了文件名或标题）。
5. **语言**：始终使用中文详细回答。

现在请回答用户的问题。`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages } = body;
        const history: ChatMessage[] = messages || [];
        const lastMessage = history[history.length - 1];
        const userQuery = lastMessage.content;

        // 1. 简单的关键词检索 (RAG)
        // 在生产环境中，这里应该使用向量数据库 (Vector DB) + Embedding
        // 为了保持轻量和免费，我们使用本地简单的关键词匹配
        const knowledgePath = path.join(process.cwd(), "public", "knowledge.json");
        let context = "";

        if (fs.existsSync(knowledgePath)) {
            try {
                const knowledgeData: KnowledgeItem[] = JSON.parse(fs.readFileSync(knowledgePath, "utf-8"));

                // 简单的关键词评分
                const queryTerms = userQuery.toLowerCase().split(/[\s,，]+/);
                const rankedDocs = knowledgeData.map(doc => {
                    let score = 0;
                    const contentLower = doc.content.toLowerCase();
                    queryTerms.forEach(term => {
                        if (term && contentLower.includes(term)) {
                            score += 1;
                        }
                    });
                    return { doc, score };
                })
                    .filter(item => item.score > 0)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3); // 取前3个最相关的片段

                if (rankedDocs.length > 0) {
                    context = rankedDocs.map(item => `[来源: ${item.doc.source}]\n${item.doc.content}`).join("\n\n");
                }
            } catch (e) {
                console.error("Failed to read knowledge base:", e);
            }
        }

        // 2. 构建最终提示词
        const filledSystemPrompt = SYSTEM_PROMPT.replace("{context}", context || "暂无相关上下文，请依靠你的通用知识回答。");

        const finalMessages = [
            { role: "system", content: filledSystemPrompt },
            ...history
        ];

        // 3. 调用 SiliconFlow API
        const apiKey = process.env.SILICONFLOW_API_KEY;
        const model = process.env.NEXT_PUBLIC_AI_MODEL || "Qwen/Qwen2.5-7B-Instruct"; // 默认使用 Qwen2.5

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
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: model,
                    messages: finalMessages,
                    stream: true, // 开启流式传输
                    temperature: 0.7
                }),
                signal: controller.signal
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
                async start(controller) {
                    if (!response.body) {
                        controller.close();
                        return;
                    }
                    const reader = response.body.getReader();

                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            const chunk = decoder.decode(value, { stream: true });
                            // SiliconFlow (OpenAI compatible) returns lines starting with "data: "
                            const lines = chunk.split("\n");

                            for (const line of lines) {
                                if (line.startsWith("data: ") && line !== "data: [DONE]") {
                                    try {
                                        const data = JSON.parse(line.slice(6));
                                        const content = data.choices[0]?.delta?.content || "";
                                        if (content) {
                                            controller.enqueue(encoder.encode(content));
                                        }
                                    } catch (e) {
                                        // ignore parse errors for partial chunks
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        console.error("Stream reading error:", err);
                        controller.error(err);
                    } finally {
                        controller.close();
                    }
                }
            });

            return new NextResponse(stream, {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                },
            });

        } catch (fetchError: any) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                return NextResponse.json({ error: "Upstream API timeout" }, { status: 504 });
            }
            throw fetchError;
        }

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
