"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Quote, Feather, Tag } from "lucide-react";
import { type PostSummary } from "@/lib/posts";

const FALLBACK_TAG = "未分类";

export default function EssayList({ posts }: { posts: PostSummary[] }) {
    const [activeTag, setActiveTag] = useState<string | null>(null);

    // 收集所有 tag，去重排序
    const allTags = useMemo(() => {
        const set = new Set<string>();
        posts.forEach((p) => {
            if (p.tags && p.tags.length > 0) {
                p.tags.forEach((t) => set.add(t));
            } else {
                set.add(FALLBACK_TAG);
            }
        });
        return Array.from(set).sort();
    }, [posts]);

    const filtered = activeTag
        ? posts.filter((p) =>
            activeTag === FALLBACK_TAG
                ? !p.tags || p.tags.length === 0
                : p.tags?.includes(activeTag)
        )
        : posts;

    return (
        <div className="max-w-4xl w-full space-y-8 p-6 sm:p-0 relative">
            {/* Header */}
            <div className="space-y-2 text-center sm:text-left pt-0 sm:pt-4">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent inline-flex items-center gap-3 font-serif">
                    <Feather className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    生活随笔
                    <span className="text-base font-normal text-zinc-400 dark:text-zinc-500 font-sans bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                        {posts.length} 篇
                    </span>
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-serif italic">
                    &quot;人生逐梦正当时，且行且歌。&quot;
                </p>
                <div className="h-1 w-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-4 mx-auto sm:mx-0"></div>
            </div>

            {/* Tag Filter */}
            {allTags.length > 1 && (
                <div className="flex flex-wrap gap-2 items-center">
                    <Tag className="w-4 h-4 text-zinc-400 shrink-0" />
                    <button
                        onClick={() => setActiveTag(null)}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 border ${activeTag === null
                                ? "bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20"
                                : "bg-transparent text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-600 dark:hover:text-purple-400"
                            }`}
                    >
                        全部
                    </button>
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 border ${activeTag === tag
                                    ? "bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20"
                                    : "bg-transparent text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-600 dark:hover:text-purple-400"
                                }`}
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid gap-6 py-4 animate-fade-in-up">
                {filtered.length === 0 && (
                    <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                        该分类下暂无随笔
                    </div>
                )}

                {filtered.map((post, index) => (
                    <Link key={post.slug} href={`/essays/${post.slug}`} prefetch={true}>
                        <div
                            className="group relative p-8 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-zinc-700/50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 opacity-0 animate-fade-in-up"
                            style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                                    <h2 className="text-2xl font-serif font-medium text-zinc-800 dark:text-zinc-100 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                                        {post.title}
                                    </h2>
                                    <span className="text-xs font-mono text-zinc-400 pt-0 sm:pt-2">
                                        {post.date}
                                    </span>
                                </div>

                                <div className="relative pl-6 border-l-2 border-purple-200 dark:border-purple-900/50">
                                    <Quote className="absolute -top-1 left-0 -ml-[9px] w-4 h-4 text-purple-300 dark:text-purple-800 fill-purple-100 dark:fill-purple-900/20 bg-white dark:bg-zinc-900" />
                                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-serif italic line-clamp-3">
                                        {post.description}
                                    </p>
                                </div>

                                <div className="flex justify-end items-center mt-2">
                                    <span className="text-xs text-purple-500 opacity-100 sm:opacity-60 sm:group-hover:opacity-100 transition-all transform translate-x-0 sm:-translate-x-2 sm:group-hover:translate-x-0 flex items-center gap-1 font-serif">
                                        阅读全文 &rarr;
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
