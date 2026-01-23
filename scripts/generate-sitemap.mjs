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

function generateSitemap() {
    const posts = getFiles(POSTS_DIR).map(file => {
        const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
        const { data } = matter(content);
        return {
            slug: file.replace('.md', ''),
            date: data.date,
            draft: data.draft || false
        };
    }).filter(post => !post.draft);

    const essays = getFiles(ESSAYS_DIR).map(file => {
        const content = fs.readFileSync(path.join(ESSAYS_DIR, file), 'utf8');
        const { data } = matter(content);
        return {
            slug: file.replace('.md', ''),
            date: data.date,
            draft: data.draft || false
        };
    }).filter(essay => !essay.draft);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${BASE_URL}</loc>
    <changefreq>yearly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/essays</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/portal</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Blog Posts -->
  ${posts.map(post => {
        let dateStr = "";
        try {
            dateStr = new Date(post.date).toISOString().split('T')[0];
        } catch (e) {
            dateStr = new Date().toISOString().split('T')[0];
        }
        return `
  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }).join('')}

  <!-- Essays -->
  ${essays.map(essay => {
        let dateStr = "";
        try {
            dateStr = new Date(essay.date).toISOString().split('T')[0];
        } catch (e) {
            dateStr = new Date().toISOString().split('T')[0];
        }
        return `
  <url>
    <loc>${BASE_URL}/essays/${essay.slug}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }).join('')}
</urlset>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
    console.log('✅ Generated sitemap.xml');
}

generateSitemap();
