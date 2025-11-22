import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

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

export function getAllPosts(): Post[] {
  // Ensure directory exists to avoid crash on first run if empty
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get slug
    const slug = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    const stats = readingTime(matterResult.content);

    // Combine the data with the id
    return {
      slug,
      content: matterResult.content,
      wordCount: matterResult.content.length, // Simple character count for Chinese
      readingTime: Math.ceil(stats.minutes) + ' 分钟',
      cover: matterResult.data.cover || null,
      award: matterResult.data.award || null,
      ...(matterResult.data as { title: string; date: string; description: string; tags: string[] }),
    };
  });
  
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPostBySlug(slug: string): Post | null {
  try {
    // Decode slug to handle Chinese characters in URL
    const decodedSlug = decodeURIComponent(slug);
    const fullPath = path.join(postsDirectory, `${decodedSlug}.md`);
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
      ...(matterResult.data as { title: string; date: string; description: string; tags: string[] }),
    };
  } catch (e) {
    console.error(`Error reading post ${slug}:`, e);
    return null;
  }
}
