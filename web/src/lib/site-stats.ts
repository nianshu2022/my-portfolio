import { cache } from "react";
import { getAllPostSummaries, getAllEssaySummaries } from "@/lib/posts";

export interface SiteStats {
  totalPosts: number;
  totalEssays: number;
  totalTags: number;
  avgWordCount: number;
  topTags: { tag: string; count: number }[];
}

export const getSiteStats = cache((): SiteStats => {
  const posts = getAllPostSummaries();
  const essays = getAllEssaySummaries();

  const allItems = [...posts, ...essays];
  const totalWords = allItems.reduce((sum, item) => sum + (item.wordCount || 0), 0);
  const avgWordCount = allItems.length > 0 ? Math.round(totalWords / allItems.length) : 0;

  const tagCount = new Map<string, number>();
  for (const item of allItems) {
    for (const tag of item.tags || []) {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    }
  }

  const topTags = [...tagCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));

  return {
    totalPosts: posts.length,
    totalEssays: essays.length,
    totalTags: tagCount.size,
    avgWordCount,
    topTags,
  };
});
