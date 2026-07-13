"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PostSummary } from "@/lib/posts";

interface PostNavigationProps {
    prev: PostSummary | null;
    next: PostSummary | null;
    basePath?: string;
}

export default function PostNavigation({ prev, next, basePath = "/blog" }: PostNavigationProps) {
    if (!prev && !next) return null;
    const noun = basePath === "/essays" ? "随笔" : "文章";

    return (
        <nav className="mt-12 border-t border-border pt-8">
            <p className="mb-4 text-xs font-semibold text-muted-foreground">相邻{noun}</p>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                {prev ? (
                    <Link
                        href={`${basePath}/${prev.slug}`}
                        className="group flex flex-1 items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
                    >
                        <ChevronLeft className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                        <div className="min-w-0">
                            <div className="mb-1 text-xs text-muted-foreground">上一篇{noun}</div>
                            <div className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
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
                        href={`${basePath}/${next.slug}`}
                        className="group flex flex-1 items-center justify-end gap-3 rounded-xl border border-border bg-card p-4 text-right transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
                    >
                        <div className="min-w-0">
                            <div className="mb-1 text-xs text-muted-foreground">下一篇{noun}</div>
                            <div className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                                {next.title}
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                    </Link>
                ) : (
                    <div className="flex-1" />
                )}
            </div>
        </nav>
    );
}
