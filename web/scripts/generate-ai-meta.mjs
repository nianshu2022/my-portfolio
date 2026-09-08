import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'src/content/posts');
const OUTPUT_DIR = path.join(process.cwd(), 'src/content/generated');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'ai-post-meta.json');

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
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const MODEL = 'Qwen/Qwen2.5-7B-Instruct';

function getAllPostFiles(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getAllPostFiles(fullPath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

// 用正则解析规范文本，杜绝 JSON 格式畸变
function parseMarkdownOutput(text) {
  let tldr = '';
  let keyTakeaways = [];
  let mermaid = '';

  const tldrMatch = text.match(/###\s*TLDR\s*\n([\s\S]*?)(?=###|$)/i);
  if (tldrMatch) {
    tldr = tldrMatch[1].trim().replace(/^[-*•]\s*/, '');
  }

  const takeawaysMatch = text.match(/###\s*KEY_TAKEAWAYS\s*\n([\s\S]*?)(?=###|$)/i);
  if (takeawaysMatch) {
    keyTakeaways = takeawaysMatch[1]
      .split('\n')
      .map(line => line.trim().replace(/^[-*•\d.]\s*/, ''))
      .filter(line => line.length > 2);
  }

  const mermaidMatch = text.match(/###\s*MERMAID\s*\n(?:```(?:mermaid)?\s*)?([\s\S]*?)(?:```|(?=###)|$)/i);
  if (mermaidMatch) {
    const candidate = mermaidMatch[1].trim();
    if (candidate.startsWith('graph ') || candidate.startsWith('flowchart ')) {
      mermaid = candidate;
    }
  }

  return { tldr, keyTakeaways: keyTakeaways.slice(0, 3), mermaid };
}

async function generateMetaForPost(title, content) {
  if (!API_KEY) return null;

  const prompt = `你是一个高级极客技术博主“念舒”的技术导读助手。请阅读以下博文，输出结构化的导读内容。

文章标题：${title}
文章正文节选：
${content.slice(0, 2500)}

【必须按照以下格式严格输出，不要包含多余寒暄】：
### TLDR
用干练通俗的1~2句话概括本文核心（解决什么痛点、核心思路是什么）。

### KEY_TAKEAWAYS
- 核心要点1
- 核心要点2
- 核心要点3

### MERMAID
如果是排错、部署或架构类文章，给出精简有效的 graph TD 流程图代码（首行必须为 graph TD）。若无需流程图，请直接写 NONE。`;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const rawText = data.choices?.[0]?.message?.content || '';
    return parseMarkdownOutput(rawText);
  } catch (error) {
    console.error(`❌ 生成失败 (${title}):`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 开始提取与生成文章 AI 极客导读与思维图...');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let existingData = {};
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    } catch {
      existingData = {};
    }
  }

  const postFiles = getAllPostFiles(POSTS_DIR);
  let updatedCount = 0;

  for (const filePath of postFiles) {
    const slug = path.basename(filePath, '.md');
    const stat = fs.statSync(filePath);
    const mtime = stat.mtimeMs;

    // 如果已经有高质量数据且文件没变，跳过
    if (existingData[slug] && existingData[slug].mtime === mtime && existingData[slug].tldr) {
      continue;
    }

    const raw = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(raw);
    const title = frontmatter.title || slug;

    console.log(`⏳ 正在分析: [${title}]`);
    const aiMeta = await generateMetaForPost(title, content);

    if (aiMeta && (aiMeta.tldr || aiMeta.keyTakeaways.length > 0)) {
      existingData[slug] = {
        title,
        mtime,
        updatedAt: new Date().toISOString(),
        ...aiMeta,
      };
      updatedCount++;
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(existingData, null, 2), 'utf8');
      console.log(`✅ 已生成高质量导读: ${title}`);
    }

    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`🎉 导读生成完成！共处理 ${updatedCount} 篇文章。`);
}

main().catch(console.error);
