"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, X } from "lucide-react";
import type { Post } from "@/lib/posts";

type BlogListProps = {
  posts: Post[];
};

const FALLBACK_TAG = "未分类";
const ALL_TAG = "全部";

export default function BlogList({ posts }: BlogListProps) {
  const tagCounts = useMemo(() => {
    return posts.reduce<Record<string, number>>((acc, post) => {
      const tags = post.tags && post.tags.length > 0 ? post.tags : [FALLBACK_TAG];
      tags.forEach((tag) => {
        const normalized = tag.trim() || FALLBACK_TAG;
        acc[normalized] = (acc[normalized] || 0) + 1;
      });
      return acc;
    }, {});
  }, [posts]);

  const sortedTags = useMemo(() => {
    return Object.entries(tagCounts)
      .sort((a, b) => {
        if (b[1] === a[1]) {
          return a[0].localeCompare(b[0]);
        }
        return b[1] - a[1];
      })
      .map(([tag, count]) => ({ tag, count }));
  }, [tagCounts]);

  const [activeTag, setActiveTag] = useState<string>(ALL_TAG);

  const filteredPosts = useMemo(() => {
    if (activeTag === ALL_TAG) {
      return posts;
    }
    if (activeTag === FALLBACK_TAG) {
      return posts.filter((post) => !post.tags || post.tags.length === 0);
    }
    return posts.filter((post) => post.tags?.includes(activeTag));
  }, [activeTag, posts]);

  return (
    <div className="max-w-6xl w-full flex flex-col xl:flex-row gap-6">
      <div className="flex-1 space-y-8 backdrop-blur-xl bg-white/30 dark:bg-zinc-900/30 p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl relative">
        <div className="space-y-2 text-center sm:text-left pt-8 sm:pt-4 sm:pl-20">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-flex items-center gap-3 font-serif">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            技术博客
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-serif">
            分享产品思考与技术折腾笔记。
          </p>
        </div>

        <div className="grid gap-4 py-4">
          {filteredPosts.length === 0 && (
            <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              暂无匹配文章
            </div>
          )}

          {filteredPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="p-6 bg-white/60 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm hover:shadow-lg transition-all cursor-pointer group hover:-translate-x-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                  <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 group-hover:text-blue-600 transition-colors font-serif">
                    {post.title}
                  </h2>
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded self-start sm:self-auto shrink-0">
                    {post.date}
                  </span>
                </div>

                <p className="text-zinc-600 dark:text-zinc-400 mb-4 text-sm line-clamp-2">
                  {post.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2 flex-wrap">
                    {(post.tags && post.tags.length > 0 ? post.tags : [FALLBACK_TAG]).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-full font-medium border border-blue-100 dark:border-blue-800/30"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 ml-2">
                    阅读全文 &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <aside className="xl:w-72 flex-shrink-0">
        <div className="p-5 bg-white/40 dark:bg-zinc-900/40 rounded-3xl border border-white/20 dark:border-zinc-800/50 backdrop-blur-xl shadow-xl sticky top-10">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
                标签分类
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                共 {sortedTags.length} 类 · {posts.length} 篇
              </p>
            </div>
            {activeTag !== ALL_TAG && (
              <button
                className="p-2 rounded-full border border-blue-200/60 dark:border-blue-800/50 bg-blue-50/70 dark:bg-blue-900/30 text-blue-600 dark:text-blue-200 shadow-sm hover:shadow-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all"
                onClick={() => setActiveTag(ALL_TAG)}
                aria-label="清除筛选"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {[{ tag: ALL_TAG, count: posts.length }, ...sortedTags].map(({ tag, count }) => {
              const isActive = tag === activeTag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-all ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white/70 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-200 border-zinc-100/60 dark:border-zinc-800/60"
                  }`}
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500"></span>
                  <span className="font-medium">{tag}</span>
                  <span className="text-[11px] font-semibold">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}

