import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import GithubSlugger from 'github-slugger';

const BASE_URL = 'https://blog.nianshu2022.cn';
const CONTENT_ROOT = path.join(process.cwd(), 'src/content');
const PUBLIC_API_DIR = path.join(process.cwd(), 'public/api');

const collections = [
  {
    type: 'post',
    listName: 'posts',
    title: '技术博客',
    contentDir: path.join(CONTENT_ROOT, 'posts'),
    publicDir: path.join(PUBLIC_API_DIR, 'posts'),
    routePrefix: '/blog',
  },
  {
    type: 'essay',
    listName: 'essays',
    title: '生活随笔',
    contentDir: path.join(CONTENT_ROOT, 'essays'),
    publicDir: path.join(PUBLIC_API_DIR, 'essays'),
    routePrefix: '/essays',
  },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function getMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  const files = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

function formatDate(date) {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }

  return String(date || '');
}

function getWordCount(content) {
  return content.replace(/\s+/g, '').length;
}

function getToc(content) {
  const slugger = new GithubSlugger();
  const headings = content.match(/^#{2,3}\s+.+$/gm) || [];

  return headings.map((heading) => {
    const level = heading.match(/^#+/)?.[0].length || 2;
    const title = heading.replace(/^#+\s+/, '');

    return {
      title,
      slug: slugger.slug(title),
      level,
    };
  });
}

function normalizeAssetUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${BASE_URL}${url}`;

  return url;
}

function buildItem(filePath, collection) {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const slug = path.basename(filePath, '.md');
  const date = formatDate(data.date);
  const url = `${BASE_URL}${collection.routePrefix}/${encodeURIComponent(slug)}`;

  return {
    id: `${collection.type}:${slug}`,
    slug,
    type: collection.type,
    collection: collection.listName,
    title: data.title || 'Untitled',
    description: data.description || '',
    date,
    tags: Array.isArray(data.tags) ? data.tags : [],
    cover: normalizeAssetUrl(data.cover),
    award: normalizeAssetUrl(data.award),
    draft: Boolean(data.draft),
    url,
    path: `${collection.routePrefix}/${slug}`,
    wordCount: getWordCount(content),
    readingTime: `${Math.ceil(readingTime(content).minutes)} 分钟`,
    toc: getToc(content),
    content,
  };
}

function toSummary(item) {
  const { content, toc, draft, ...summary } = item;
  return {
    ...summary,
    tocCount: toc.length,
  };
}

function byDateDesc(a, b) {
  if (a.date !== b.date) {
    return b.date.localeCompare(a.date);
  }

  return a.slug.localeCompare(b.slug);
}

function buildTags(items) {
  const tagMap = new Map();

  for (const item of items) {
    for (const tag of item.tags) {
      const current = tagMap.get(tag) || {
        name: tag,
        count: 0,
        posts: 0,
        essays: 0,
      };

      current.count += 1;
      if (item.type === 'post') current.posts += 1;
      if (item.type === 'essay') current.essays += 1;
      tagMap.set(tag, current);
    }
  }

  return [...tagMap.values()].sort((a, b) => {
    if (a.count !== b.count) return b.count - a.count;
    return a.name.localeCompare(b.name, 'zh-CN');
  });
}

function generateMiniappApi() {
  fs.rmSync(PUBLIC_API_DIR, { recursive: true, force: true });
  ensureDir(PUBLIC_API_DIR);

  const manifest = {
    name: '念舒的数字花园',
    baseUrl: BASE_URL,
    generatedAt: new Date().toISOString(),
    collections: collections.map(({ listName, title, routePrefix }) => ({
      name: listName,
      title,
      listUrl: `${BASE_URL}/api/${listName}.json`,
      routePrefix,
    })),
  };

  const allItems = [];

  for (const collection of collections) {
    ensureDir(collection.publicDir);

    const items = getMarkdownFiles(collection.contentDir)
      .map((filePath) => buildItem(filePath, collection))
      .filter((item) => !item.draft)
      .sort(byDateDesc);

    for (const item of items) {
      writeJson(path.join(collection.publicDir, `${item.slug}.json`), item);
    }

    const summaries = items.map(toSummary);
    writeJson(path.join(PUBLIC_API_DIR, `${collection.listName}.json`), summaries);
    writeJson(path.join(collection.publicDir, 'index.json'), summaries);

    allItems.push(...items);
  }

  const garden = allItems.sort(byDateDesc).map(toSummary);
  writeJson(path.join(PUBLIC_API_DIR, 'garden.json'), garden);
  writeJson(path.join(PUBLIC_API_DIR, 'tags.json'), buildTags(allItems));
  writeJson(path.join(PUBLIC_API_DIR, 'manifest.json'), {
    ...manifest,
    counts: {
      items: garden.length,
      posts: garden.filter((item) => item.type === 'post').length,
      essays: garden.filter((item) => item.type === 'essay').length,
      tags: buildTags(allItems).length,
    },
  });

  console.log(`Generated miniapp JSON API with ${garden.length} published items.`);
}

generateMiniappApi();
