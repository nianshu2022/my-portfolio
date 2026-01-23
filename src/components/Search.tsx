"use client";

import { useState } from "react";
import { PostSummary } from "@/lib/posts";
import { Search as SearchIcon } from "lucide-react";
import Link from "next/link";

interface SearchProps {
    posts: PostSummary[];
}

export default function Search({ posts }: SearchProps) {
    const [query, setQuery] = useState("");

    const filteredPosts = posts.filter((post) => {
        const searchContent = `${post.title} ${post.description} ${post.tags.join(" ")}`.toLowerCase();
        return searchContent.includes(query.toLowerCase());
    });

    return (
        <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100"
                    placeholder="搜索文章、标签..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {query && (
                <div className="mt-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {filteredPosts.length > 0 ? (
                        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                            {filteredPosts.slice(0, 5).map((post) => (
                                <li key={post.slug}>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="block p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                                    >
                                        <div className="font-medium text-zinc-900 dark:text-zinc-100">{post.title}</div>
                                        <div className="text-xs text-zinc-500 mt-1 flex gap-2">
                                            <span>{post.date}</span>
                                            {post.tags.length > 0 && <span>#{post.tags[0]}</span>}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-8 text-center text-zinc-500">
                            未找到相关文章
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
