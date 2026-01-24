import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { cache } from 'react';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');
const essaysDirectory = path.join(process.cwd(), 'src/content/essays');

// Simple cache to avoid redundant file system scans during build (module level cache)
const filesCache = new Map<string, string[]>();

import GithubSlugger from 'github-slugger';

// ... (imports)

export type TOCItem = {
  title: string;
  slug: string;
  level: number;
};

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
  draft?: boolean;
  toc: TOCItem[];
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
// Wrapped in cache() for Request Memoization in React Server Components
const getAllItems = cache((baseDirectory: string): Post[] => {
  const allFilePaths = getAllFiles(baseDirectory);

  const allItemsData = allFilePaths.map((fullPath) => {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const stats = readingTime(matterResult.content);

    // Extract slug from filename
    const fileName = path.basename(fullPath);
    const slug = fileName.replace(/\.md$/, '');

    // Extract TOC
    const slugger = new GithubSlugger();
    const toc: TOCItem[] = [];
    const headings = matterResult.content.match(/^#{2,3}\s+.+$/gm);

    if (headings) {
      headings.forEach((heading) => {
        const level = heading.match(/^#+/)?.[0].length || 2;
        const title = heading.replace(/^#+\s+/, '');
        const anchor = slugger.slug(title);
        toc.push({ title, slug: anchor, level });
      });
    }

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
      draft: matterResult.data.draft || false,
      toc,
    } as Post;
  });

  // Filter out drafts in production
  const filteredItems = allItemsData.filter(item => {
    if (process.env.NODE_ENV === 'production') {
      return !item.draft;
    }
    return true;
  });

  return filteredItems.sort((a, b) => {
    if (a.date !== b.date) {
      return b.date.localeCompare(a.date);
    }
    return a.slug.localeCompare(b.slug);
  });
});

// Helper function to get summaries
const getAllSummaries = cache((baseDirectory: string): PostSummary[] => {
  const items = getAllItems(baseDirectory);
  return items.map(item => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { content, ...summary } = item;
    return summary;
  });
});

// Helper function to validate slug format
function isValidSlug(slug: string): boolean {
  const slugPattern = /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/;
  return slugPattern.test(slug);
}

// Helper function to get a single item by slug
// We don't cache this wrapper heavily, but we rely on getAllItems cache.
// Note: We scan all items to find by proper slug to support recursive directories accurately if needed,
// OR we can just scan for the file. The original logic scanned recursive files.
// To keep it consistent with 'draft' filtering, we should probably use getAllItems to find the post.
// However, reading one file is faster if we know the path. 
// BUT, to respect 'draft' mode uniformly, let's use getAllItems().find().
// This might be slightly slower (O(N)) but N is small (<1000) and it ensures drafts are hidden safely.
const getItemBySlug = cache((baseDirectory: string, slug: string): Post | null => {
  if (!isValidSlug(slug)) return null;

  // Use getAllItems to ensure drafts are filtered in production
  const allItems = getAllItems(baseDirectory);
  const item = allItems.find(p => p.slug === slug);

  if (item) return item;

  // Fallback: decodeURIComponent check
  try {
    const decoded = decodeURIComponent(slug);
    if (decoded !== slug) {
      return allItems.find(p => p.slug === decoded) || null;
    }
  } catch {
    // ignore
  }

  return null;
});


// Posts API
export const getAllPosts = cache(() => {
  return getAllItems(postsDirectory);
});

export const getAllPostSummaries = cache(() => {
  return getAllSummaries(postsDirectory);
});

export const getPostBySlug = cache((slug: string) => {
  return getItemBySlug(postsDirectory, slug);
});

// Essays API
export const getAllEssays = cache(() => {
  return getAllItems(essaysDirectory);
});

export const getAllEssaySummaries = cache(() => {
  return getAllSummaries(essaysDirectory);
});

export const getEssayBySlug = cache((slug: string) => {
  return getItemBySlug(essaysDirectory, slug);
});

// Related Posts Logic
export const getRelatedPosts = cache((currentSlug: string): PostSummary[] => {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];

  const allPosts = getAllPostSummaries();

  const relatedPosts = allPosts
    .filter(post => post.slug !== currentSlug)
    .map(post => {
      let score = 0;
      // Tag intersection
      if (currentPost.tags && post.tags) {
        const intersection = currentPost.tags.filter(tag => post.tags.includes(tag));
        score += intersection.length;
      }
      return { post, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) // Return top 3
    .map(item => item.post);

  return relatedPosts;
});

// Get adjacent posts for prev/next navigation
export const getAdjacentPosts = cache((currentSlug: string): { prev: PostSummary | null; next: PostSummary | null } => {
  const allPosts = getAllPostSummaries();
  const currentIndex = allPosts.findIndex(post => post.slug === currentSlug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  // Note: Posts are sorted by date descending (newest first)
  // "next" = older post (higher index), "prev" = newer post (lower index)
  const prev = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const next = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return { prev, next };
});