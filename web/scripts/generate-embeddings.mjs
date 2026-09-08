import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'src/content/posts');
const ESSAYS_DIR = path.join(process.cwd(), 'src/content/essays');
const OUTPUT_DIR = path.join(process.cwd(), 'public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'site-knowledge.json');

function getApiKey() {
  if (process.env.SILICONFLOW_API_KEY) {
    return process.env.SILICONFLOW_API_KEY;
  }
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/SILICONFLOW_API_KEY=([^\r\n]+)/);
    if (match) return match[1].trim();
  }
  return '';
}

const API_KEY = getApiKey();
const EMBED_URL = 'https://api.siliconflow.cn/v1/embeddings';
const EMBED_MODEL = 'BAAI/bge-m3';

function getAllMdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getAllMdFiles(fullPath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

// 智能分块切片
function chunkContent(content, maxChunkSize = 450) {
  // 清洗掉一些纯标记干扰
  const clean = content.replace(/```[\s\S]*?```/g, '[代码块]').trim();
  const paragraphs = clean.split(/\n\s*\n/);
  const chunks = [];
  let current = '';

  for (const p of paragraphs) {
    const trimmed = p.trim();
    if (!trimmed) continue;

    if ((current + '\n' + trimmed).length <= maxChunkSize) {
      current = current ? current + '\n' + trimmed : trimmed;
    } else {
      if (current) chunks.push(current);
      // 如果单段过长，强制截断
      if (trimmed.length > maxChunkSize) {
        for (let i = 0; i < trimmed.length; i += maxChunkSize) {
          chunks.push(trimmed.slice(i, i + maxChunkSize));
        }
        current = '';
      } else {
        current = trimmed;
      }
    }
  }

  if (current) chunks.push(current);
  return chunks.filter(c => c.length > 20); // 过滤过短废弃片段
}

async function getEmbedding(text) {
  const res = await fetch(EMBED_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input: text.slice(0, 1000), // bge-m3 支持长文本，保守截断
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embedding API Error: ${err}`);
  }

  const data = await res.json();
  return data.data?.[0]?.embedding;
}

async function main() {
  console.log('🚀 开始为全站文章与随笔生成向量知识库 (BAAI/bge-m3)...');

  if (!API_KEY) {
    console.warn('⚠️ 未配置 SILICONFLOW_API_KEY，跳过向量库生成');
    return;
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 缓存检查：如果已有完整知识库且未指定 --force，跳过请求
  const isForce = process.argv.includes('--force');
  if (!isForce && fs.existsSync(OUTPUT_FILE)) {
    try {
      const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
      if (Array.isArray(existing) && existing.length > 50) {
        console.log(`⚡ 检测到已有知识库 (${existing.length} 个片段)，跳过重新生成。如需强制更新请运行 npm run generate:ai -- --force`);
        return;
      }
    } catch {
      // 损坏则继续生成
    }
  }

  const postFiles = getAllMdFiles(POSTS_DIR).map(f => ({ path: f, type: 'blog' }));
  const essayFiles = getAllMdFiles(ESSAYS_DIR).map(f => ({ path: f, type: 'essays' }));
  const allFiles = [...postFiles, ...essayFiles];

  console.log(`📚 发现文章总数: ${allFiles.length}`);

  const knowledgeItems = [];

  for (const fileObj of allFiles) {
    const raw = fs.readFileSync(fileObj.path, 'utf8');
    const { data: frontmatter, content } = matter(raw);
    const slug = path.basename(fileObj.path, '.md');
    const title = frontmatter.title || slug;
    const url = `/${fileObj.type}/${slug}`;

    console.log(`🔍 正在切分与向量化: [${title}]`);
    const chunks = chunkContent(content);

    // 每个文件取前 6~8 个核心切片，兼顾覆盖面与体积
    const selectedChunks = chunks.slice(0, 8);

    for (let i = 0; i < selectedChunks.length; i++) {
      const chunkText = selectedChunks[i];
      try {
        const embedding = await getEmbedding(chunkText);
        knowledgeItems.push({
          id: `${slug}-${i}`,
          title,
          slug,
          url,
          type: fileObj.type,
          text: chunkText,
          embedding,
        });
        // 适当限流
        await new Promise(r => setTimeout(r, 150));
      } catch (e) {
        console.error(`❌ 切片向量化失败 (${slug}#${i}):`, e.message);
      }
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(knowledgeItems), 'utf8');
  console.log(`🎉 知识库生成完毕！总共向量化 ${knowledgeItems.length} 个知识片段，输出至: ${OUTPUT_FILE}`);
}

main().catch(console.error);
