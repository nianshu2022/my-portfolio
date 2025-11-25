import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');
const essaysDirectory = path.join(process.cwd(), 'src/content/essays');

export type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
  wordCount: number;
  readingTime: string;
  cover?: string;
  award?: string;
};

// Helper function to format date
const formatDate = (date: string | Date): string => {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return date || '';
};

// Helper function to get all items from a directory
function getAllItems(directory: string): Post[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const fileNames = fs.readdirSync(directory);
  const allItemsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(directory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const stats = readingTime(matterResult.content);

    return {
      slug,
      content: matterResult.content,
      wordCount: matterResult.content.length,
      readingTime: Math.ceil(stats.minutes) + ' 分钟',
      cover: matterResult.data.cover || null,
      award: matterResult.data.award || null,
      title: matterResult.data.title,
      description: matterResult.data.description || '',
      tags: matterResult.data.tags || [],
      date: formatDate(matterResult.data.date),
    };
  });

  return allItemsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Helper function to get a single item by slug
function getItemBySlug(directory: string, slug: string): Post | null {
  try {
    const decodedSlug = decodeURIComponent(slug);
    const fullPath = path.join(directory, `${decodedSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const stats = readingTime(matterResult.content);

    return {
      slug: decodedSlug,
      content: matterResult.content,
      wordCount: matterResult.content.length,
      readingTime: Math.ceil(stats.minutes) + ' 分钟',
      cover: matterResult.data.cover || null,
      award: matterResult.data.award || null,
      title: matterResult.data.title,
      description: matterResult.data.description || '',
      tags: matterResult.data.tags || [],
      date: formatDate(matterResult.data.date),
    };
  } catch (e) {
    console.error(`Error reading item ${slug} from ${directory}:`, e);
    return null;
  }
}

// Posts API
export function getAllPosts(): Post[] {
  return getAllItems(postsDirectory);
}

export function getPostBySlug(slug: string): Post | null {
  return getItemBySlug(postsDirectory, slug);
}

// Essays API
export function getAllEssays(): Post[] {
  return getAllItems(essaysDirectory);
}

export function getEssayBySlug(slug: string): Post | null {
  return getItemBySlug(essaysDirectory, slug);
}
