import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BASE_URL = 'https://blog.nianshu2022.cn';
const POSTS_DIR = path.join(process.cwd(), 'src/content/posts');
const ESSAYS_DIR = path.join(process.cwd(), 'src/content/essays');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

function getFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(file => file.endsWith('.md'));
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
    const posts = getFiles(POSTS_DIR).map(file => {
        const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
        const { data } = matter(content);
        return {
            slug: file.replace('.md', ''),
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
    <title>念舒的数字花园</title>
    <link>${BASE_URL}</link>
    <description>00后产品运营的个人网站，分享运营心得、增长策略与技术折腾笔记。</description>
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
