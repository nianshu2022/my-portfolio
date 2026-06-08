import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BASE_URL = 'https://blog.nianshu2022.cn';
const POSTS_DIR = path.join(process.cwd(), 'src/content/posts');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

function getMarkdownFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    const files = [];
    const items = fs.readdirSync(dir);
    for (const item of items) {
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

function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

function generateRss() {
    const posts = getMarkdownFiles(POSTS_DIR).map(filePath => {
        const content = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(content);
        return {
            slug: path.basename(filePath, '.md'),
            title: data.title || 'Untitled',
            description: data.description || '',
            date: data.date,
            draft: data.draft || false
        };
    }).filter(post => !post.draft);

    // Sort by date desc
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>念舒档案局</title>
    <link>${BASE_URL}</link>
    <description>一个 00 后技术折腾者的成长样本库，记录技术案卷、成长样本和在线服务。</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts.map(post => {
        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${BASE_URL}/blog/${post.slug}</guid>
    </item>`;
    }).join('')}
  </channel>
</rss>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'feed.xml'), rss);
    console.log('✅ Generated feed.xml');
}

generateRss();
