import { MetadataRoute } from 'next';
import { getAllPosts, getAllEssays } from '@/lib/posts';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.nianshu2022.cn';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const essays = getAllEssays();

  const postsUrls = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const essaysUrls = essays.map((essay) => ({
    url: `${BASE_URL}/essays/${essay.slug}`,
    lastModified: new Date(essay.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/essays`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/portal`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...postsUrls,
    ...essaysUrls,
  ];
}

