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

// Helper function to recursively get all files from a directory
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
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

// Helper function to get a single item by slug (searches recursively)
function getItemBySlug(baseDirectory: string, slug: string): Post | null {
  try {
    const decodedSlug = decodeURIComponent(slug);
    const allFilePaths = getAllFiles(baseDirectory);
    
    // Find the file that matches the slug regardless of which subdirectory it's in
    const targetPath = allFilePaths.find(filePath => {
      const fileName = path.basename(filePath);
      return fileName.replace(/\.md$/, '') === decodedSlug;
    });

    if (!targetPath) {
      console.error(`File not found for slug: ${decodedSlug} in ${baseDirectory}`);
      return null;
    }

    const fileContents = fs.readFileSync(targetPath, 'utf8');
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
    console.error(`Error reading item ${slug} from ${baseDirectory}:`, e);
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