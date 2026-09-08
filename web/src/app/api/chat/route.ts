import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

function getApiKey() {
  if (process.env.SILICONFLOW_API_KEY) {
    return process.env.SILICONFLOW_API_KEY;
  }
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    const match = content.match(/SILICONFLOW_API_KEY=([^\r\n]+)/);
    if (match) return match[1].trim();
  }
  return "";
}

const API_KEY = getApiKey();
const EMBED_URL = "https://api.siliconflow.cn/v1/embeddings";
const CHAT_URL = "https://api.siliconflow.cn/v1/chat/completions";
const EMBED_MODEL = "BAAI/bge-m3";
const CHAT_MODEL = process.env.AI_MODEL || "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B";

// 余弦相似度计算
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// 缓存知识库在内存中，避免每次请求重复读取
let cachedKnowledge: any[] | null = null;
function getKnowledgeBase(): any[] {
  if (cachedKnowledge) return cachedKnowledge;
  try {
    const filePath = path.join(process.cwd(), "public/data/site-knowledge.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      cachedKnowledge = JSON.parse(raw);
      return cachedKnowledge || [];
    }
  } catch (e) {
    console.error("Failed to load knowledge base:", e);
  }
  return [];
}

// 获取用户问题的向量
async function getQueryEmbedding(text: string): Promise<number[] | null> {
  try {
    const res = await fetch(EMBED_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: EMBED_MODEL,
        input: text.slice(0, 500),
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.[0]?.embedding || null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: "SILICONFLOW_API_KEY is not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const messages = body.messages || [];
    const latestUserMsg = messages.filter((m: any) => m.role === "user").pop();
    const userQuery = latestUserMsg?.content || "";

    if (!userQuery) {
      return NextResponse.json({ error: "Empty query" }, { status: 400 });
    }

    // 1. RAG 检索
    let referenceContext = "";
    const referencedArticles: Array<{ title: string; url: string }> = [];

    const knowledgeBase = getKnowledgeBase();
    if (knowledgeBase.length > 0) {
      const queryVec = await getQueryEmbedding(userQuery);
      if (queryVec) {
        const scored = knowledgeBase
          .map((item) => ({
            ...item,
            score: cosineSimilarity(queryVec, item.embedding),
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 3); // 匹配 Top 3 最相关知识片段

        // 收集文章卡片
        const seenUrls = new Set<string>();
        for (const item of scored) {
          if (!seenUrls.has(item.url) && item.score > 0.35) {
            seenUrls.add(item.url);
            referencedArticles.push({ title: item.title, url: item.url });
          }
        }

        if (scored.length > 0 && scored[0].score > 0.35) {
          referenceContext = scored
            .map((s, idx) => `【资料${idx + 1} 来自文章《${s.title}》】\n${s.text}`)
            .join("\n\n");
        }
      }
    }

    // 2. 组装 System Prompt
    const systemPrompt = `你是技术博主“念舒”的 AI 智能数字分身。
你的使命是基于念舒的真实博文、随笔和经历，帮助访客答疑解惑。
你的性格特点：真诚、严谨、客观，带有 00 后极客的探索趣味，绝不说套话空话，坚持“从现场解决真实问题”。
坐标：中国·兰州。

${
  referenceContext
    ? `【念舒的真实文章资料库参考】\n${referenceContext}\n\n请优先参考上述内容进行回答，若有相关内容，在回答中自然体现。`
    : `如果访客询问的问题在你的博文中未提及，请诚实说明，但可以凭借你的技术积累给出精炼专业的建议。`
}`;

    // 3. 请求 SiliconFlow 流式接口
    const sfResponse = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-6), // 保留最近上下文
        ],
        stream: true,
        temperature: 0.6,
      }),
    });

    if (!sfResponse.ok || !sfResponse.body) {
      const errText = await sfResponse.text();
      return NextResponse.json({ error: `API upstream error: ${errText}` }, { status: 502 });
    }

    // 4. 将流转换转发给客户端，同时注入引用文章信息
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        // 先发送引用的文章信息
        if (referencedArticles.length > 0) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ references: referencedArticles })}\n\n`)
          );
        }

        const reader = sfResponse.body!.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (e) {
          controller.error(e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
