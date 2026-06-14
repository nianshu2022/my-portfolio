import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_ROOT = path.join(__dirname, '../../');
const CONTENT_ROOT = path.join(ROOT_ROOT, 'web/src/content');
const DB_NAME = 'nianshu-garden-db';

const collections = [
  { type: 'post', dir: 'posts', listName: 'posts' },
  { type: 'essay', dir: 'essays', listName: 'essays' },
];

function getMarkdownFiles(dir) {
  const fullDir = path.join(CONTENT_ROOT, dir);
  if (!fs.existsSync(fullDir)) return [];

  const files = [];
  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  walk(fullDir);
  return files;
}

function formatDate(date) {
  if (date instanceof Date) return date.toISOString().split('T')[0];
  return String(date || '');
}

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

console.log('🚀 Starting sync to Cloudflare D1...');

let sqlStatements = [];

for (const col of collections) {
  const files = getMarkdownFiles(col.dir);
  console.log(`- Found ${files.length} ${col.type}s`);

  for (const filePath of files) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const slug = path.basename(filePath, '.md');

    if (data.draft) continue;

    const post = {
      slug,
      title: data.title || 'Untitled',
      description: data.description || '',
      type: col.type,
      category: col.listName,
      date: formatDate(data.date),
      reading_time: `${Math.ceil(readingTime(content).minutes)} 分钟`,
      cover: data.cover || '',
      tags: JSON.stringify(data.tags || []),
      content: content,
    };

    sqlStatements.push(`
      INSERT INTO posts (slug, title, description, type, category, date, reading_time, cover, tags, content)
      VALUES (
        ${escapeSql(post.slug)}, 
        ${escapeSql(post.title)}, 
        ${escapeSql(post.description)}, 
        ${escapeSql(post.type)}, 
        ${escapeSql(post.category)}, 
        ${escapeSql(post.date)}, 
        ${escapeSql(post.reading_time)}, 
        ${escapeSql(post.cover)}, 
        ${escapeSql(post.tags)}, 
        ${escapeSql(post.content)}
      )
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        type = excluded.type,
        category = excluded.category,
        date = excluded.date,
        reading_time = excluded.reading_time,
        cover = excluded.cover,
        tags = excluded.tags,
        content = excluded.content,
        updated_at = CURRENT_TIMESTAMP;
    `);

    // Ensure stats entry exists
    sqlStatements.push(`
      INSERT OR IGNORE INTO stats (slug, views, likes) VALUES (${escapeSql(post.slug)}, 0, 0);
    `);
  }
}

if (sqlStatements.length === 0) {
  console.log('✅ No content to sync.');
  process.exit(0);
}

const tempSqlFile = path.join(__dirname, 'temp_sync.sql');
fs.writeFileSync(tempSqlFile, sqlStatements.join('\n'));

console.log('📡 Executing SQL on D1 (Remote)...');
try {
  // Use --remote to sync to the live database
  execSync(`npx wrangler d1 execute ${DB_NAME} --remote --file="${tempSqlFile}"`, { stdio: 'inherit' });
  console.log('✅ Sync completed successfully!');
} catch (error) {
  console.error('❌ Sync failed:', error.message);
} finally {
  if (fs.existsSync(tempSqlFile)) fs.unlinkSync(tempSqlFile);
}
