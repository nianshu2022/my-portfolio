"use client";

import Link from "next/link";
import { Quote } from "lucide-react";
import { type PostSummary } from "@/lib/posts";
import { useState, useEffect } from "react";

export default function EssayList({ posts }: { posts: PostSummary[] }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Hydration safety: render placeholder until mounted
    if (!mounted) {
        return (
            <div className="max-w-4xl w-full space-y-8 backdrop-blur-xl bg-white/30 dark:bg-zinc-900/30 p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl opacity-0">
                <div className="min-h-[400px]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl w-full space-y-8 p-6 sm:p-0 relative">
            <div className="space-y-2 text-center sm:text-left pt-0 sm:pt-4">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent inline-flex items-center gap-3 font-serif">
                    {/* Feather icon is managed in parent or can be imported here if needed, keeping it simple */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-8 h-8 text-purple-600 dark:text-purple-400"
                    >
                        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                        <line x1="16" x2="2" y1="8" y2="22" />
                        <line x1="17.5" x2="9" y1="15" y2="15" />
                    </svg>
                    生活随笔
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-serif italic">
                    &quot;人生逐梦正当时，且行且歌。&quot;
                </p>
                <div className="h-1 w-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-4 mx-auto sm:mx-0"></div>
            </div>

            <div className="grid gap-6 py-4 animate-fade-in-up">
                {posts.map((post, index) => (
                    <Link key={post.slug} href={`/essays/${post.slug}`} prefetch={false}>
                        <div
                            className="group relative p-8 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-zinc-700/50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 opacity-0 animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
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
