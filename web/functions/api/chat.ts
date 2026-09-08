// Cloudflare Pages Function for /api/chat
interface Env {
  SILICONFLOW_API_KEY: string;
  AI_MODEL?: string;
}

const EMBED_URL = "https://api.siliconflow.cn/v1/embeddings";
const CHAT_URL = "https://api.siliconflow.cn/v1/chat/completions";
const EMBED_MODEL = "BAAI/bge-m3";

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

interface Context {
  request: Request;
  env: Env;
}

export const onRequestPost = async (context: Context) => {
  const { request, env } = context;
  const apiKey = env.SILICONFLOW_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "SILICONFLOW_API_KEY not set" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body: any = await request.json();
    const messages = body.messages || [];
    const latestUserMsg = messages.filter((m: any) => m.role === "user").pop();
    const userQuery = latestUserMsg?.content || "";

    if (!userQuery) {
      return new Response(JSON.stringify({ error: "Empty query" }), { status: 400 });
    }

    // 1. 获取知识库数据（通过同源静态资源获取）
    let referenceContext = "";
    const referencedArticles: Array<{ title: string; url: string }> = [];

    const url = new URL(request.url);
    const knowledgeUrl = `${url.origin}/data/site-knowledge.json`;

    try {
      const kbRes = await fetch(knowledgeUrl);
      if (kbRes.ok) {
        const knowledgeBase: any[] = await kbRes.json();
        
        // 向量化提问
        const embedRes = await fetch(EMBED_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: EMBED_MODEL,
            input: userQuery.slice(0, 500),
          }),
        });

        if (embedRes.ok) {
          const embedData: any = await embedRes.json();
          const queryVec = embedData.data?.[0]?.embedding;
          if (queryVec) {
            const scored = knowledgeBase
              .map((item) => ({
                ...item,
                score: cosineSimilarity(queryVec, item.embedding),
              }))
              .sort((a, b) => b.score - a.score)
              .slice(0, 3);

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
      }
    } catch (e) {
      console.warn("RAG retrieval failed, falling back to base knowledge:", e);
    }

    // 2. 组装 System Prompt
    const chatModel = env.AI_MODEL || "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B";
    const systemPrompt = `你是技术博主“念舒”的 AI 智能数字分身。
你的使命是基于念舒的真实博文、随笔和经历，帮助访客答疑解惑。
你的性格特点：真诚、严谨、客观，带有 00 后极客的探索趣味，绝不说套话空话，坚持“从现场解决真实问题”。
坐标：中国·兰州。

${
  referenceContext
    ? `【念舒的真实文章资料库参考】\n${referenceContext}\n\n请优先参考上述内容进行回答，若有相关内容，在回答中自然体现。`
    : `如果访客询问的问题在你的博文中未提及，请诚实说明，但可以凭借你的技术积累给出精炼专业的建议。`
}`;

    // 3. 请求模型接口并流式转发
    const sfResponse = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: chatModel,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-6),
        ],
        stream: true,
        temperature: 0.6,
      }),
    });

    if (!sfResponse.ok || !sfResponse.body) {
      const err = await sfResponse.text();
      return new Response(JSON.stringify({ error: `Upstream error: ${err}` }), { status: 502 });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
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
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
