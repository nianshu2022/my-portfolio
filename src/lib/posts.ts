import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');
const essaysDirectory = path.join(process.cwd(), 'src/content/essays');

// Simple cache to avoid redundant file system scans during build
const filesCache = new Map<string, string[]>();

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

export type PostSummary = Omit<Post, 'content'>;

// Helper function to format date
const formatDate = (date: string | Date): string => {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return date || '';
};

// Helper function to recursively get all files from a directory
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  if (filesCache.has(dirPath)) {
    return filesCache.get(dirPath)!;
  }

  if (!fs.existsSync(dirPath)) {
    return arrayOfFiles;
  }

  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith('.md')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  filesCache.set(dirPath, arrayOfFiles);
  return arrayOfFiles;
}

// Helper function to get all items (posts/essays)
function getAllItems(baseDirectory: string): Post[] {
  const allFilePaths = getAllFiles(baseDirectory);

  const allItemsData = allFilePaths.map((fullPath) => {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const stats = readingTime(matterResult.content);

    // Extract slug from filename, ignoring directory structure for the URL
    const fileName = path.basename(fullPath);
    const slug = fileName.replace(/\.md$/, '');

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

// Helper function to get summaries to reduce bundle size for list pages
function getAllSummaries(baseDirectory: string): PostSummary[] {
  const allFilePaths = getAllFiles(baseDirectory);

  const allItemsData = allFilePaths.map((fullPath) => {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const stats = readingTime(matterResult.content);

    const fileName = path.basename(fullPath);
    const slug = fileName.replace(/\.md$/, '');

    return {
      slug,
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

  return allItemsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Helper function to validate slug format (prevent path traversal)
function isValidSlug(slug: string): boolean {
  // Only allow alphanumeric, hyphens, underscores, and Chinese characters
  // This prevents path traversal attacks like ../../etc/passwd
  const slugPattern = /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/;
  return slugPattern.test(slug);
}

// Helper function to get a single item by slug (searches recursively)
function getItemBySlug(baseDirectory: string, slug: string): Post | null {
  try {
    // Validate slug to prevent path traversal
    if (!isValidSlug(slug)) {
      console.error(`Invalid slug format: ${slug}`);
      return null;
    }

    const allFilePaths = getAllFiles(baseDirectory);

    // Find the file that matches the slug
    let targetPath = allFilePaths.find(filePath => {
      const fileName = path.basename(filePath);
      return fileName.replace(/\.md$/, '') === slug;
    });

    // If not found, try decoding (though Next.js usually handles this)
    if (!targetPath) {
      try {
        const decoded = decodeURIComponent(slug);
        if (decoded !== slug) {
          targetPath = allFilePaths.find(filePath => {
            const fileName = path.basename(filePath);
            return fileName.replace(/\.md$/, '') === decoded;
          });
        }
      } catch {
        // Ignore decoding errors
      }
    }

    if (!targetPath) {
      console.error(`File not found for slug: ${slug} in ${baseDirectory}`);
      return null;
    }

    // Additional security: ensure the target path is within the expected directory
    const relativePath = path.relative(baseDirectory, targetPath);
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      console.error(`Security violation: attempted access outside directory`);
      return null;
    }

    const fileContents = fs.readFileSync(targetPath, 'utf8');
    const matterResult = matter(fileContents);
    const stats = readingTime(matterResult.content);

    return {
      slug: slug,
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
    console.error(`Error reading item ${slug} from ${baseDirectory}:`, e);
    return null;
  }
}

// Posts API
export function getAllPosts(): Post[] {
  return getAllItems(postsDirectory);
}

export function getAllPostSummaries(): PostSummary[] {
  return getAllSummaries(postsDirectory);
}

export function getPostBySlug(slug: string): Post | null {
  return getItemBySlug(postsDirectory, slug);
}

// Essays API
export function getAllEssays(): Post[] {
  return getAllItems(essaysDirectory);
}

export function getAllEssaySummaries(): PostSummary[] {
  return getAllSummaries(essaysDirectory);
}

export function getEssayBySlug(slug: string): Post | null {
  return getItemBySlug(essaysDirectory, slug);
}