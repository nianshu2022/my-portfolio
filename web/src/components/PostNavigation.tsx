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

    return (
        <nav className="mt-12 border-t border-border pt-8">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Continue Reading
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                {/* Previous (Newer) */}
                {prev ? (
                    <Link
                        href={`${basePath}/${prev.slug}`}
                        className="garden-panel group flex flex-1 items-center gap-3 p-4 transition-colors hover:bg-secondary"
                    >
                        <ChevronLeft className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                        <div className="min-w-0">
                            <div className="mb-1 text-xs text-muted-foreground">上一篇</div>
                            <div className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
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
                        className="garden-panel group flex flex-1 items-center justify-end gap-3 p-4 text-right transition-colors hover:bg-secondary"
                    >
                        <div className="min-w-0">
                            <div className="mb-1 text-xs text-muted-foreground">下一篇</div>
                            <div className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                                {next.title}
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                    </Link>
                ) : (
                    <div className="flex-1" />
                )}
            </div>
        </nav>
    );
}
