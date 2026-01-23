"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PostSummary } from "@/lib/posts";

interface PostNavigationProps {
    prev: PostSummary | null;
    next: PostSummary | null;
}

export default function PostNavigation({ prev, next }: PostNavigationProps) {
    if (!prev && !next) return null;

    return (
        <nav className="mt-12 pt-8 border-t border-zinc-200/50 dark:border-zinc-700/50">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                {/* Previous (Newer) */}
                {prev ? (
                    <Link
                        href={`/blog/${prev.slug}`}
                        className="group flex-1 flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200/50 dark:border-zinc-700/50"
                    >
                        <ChevronLeft className="w-5 h-5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors shrink-0" />
                        <div className="min-w-0">
                            <div className="text-xs text-zinc-400 mb-1">上一篇</div>
                            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {prev.title}
                            </div>
                        </div>
                    </Link>
                ) : (
                    <div className="flex-1" />
                )}

                {/* Next (Older) */}
                {next ? (
                    <Link
                        href={`/blog/${next.slug}`}
                        className="group flex-1 flex items-center justify-end gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200/50 dark:border-zinc-700/50 text-right"
                    >
                        <div className="min-w-0">
                            <div className="text-xs text-zinc-400 mb-1">下一篇</div>
                            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {next.title}
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors shrink-0" />
                    </Link>
                ) : (
                    <div className="flex-1" />
                )}
            </div>
        </nav>
    );
}
