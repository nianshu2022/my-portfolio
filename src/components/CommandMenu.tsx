"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Search, Feather } from "lucide-react";
import { PostSummary } from "@/lib/posts";

interface CommandMenuProps {
    posts: PostSummary[];
    essays: PostSummary[];
}

export default function CommandMenu({ posts, essays }: CommandMenuProps) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
            if (e.key === "/" && !open && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
                e.preventDefault();
                setOpen(true);
            }
            if (e.key === "Escape" && open) {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [open]);

    const lowerQuery = query.toLowerCase();

    const filteredPosts = posts.filter(
        (post) =>
            post.title.toLowerCase().includes(lowerQuery) ||
            post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );

    const filteredEssays = essays.filter(
        (essay) =>
            essay.title.toLowerCase().includes(lowerQuery) ||
            essay.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );

    const totalResults = filteredPosts.length + filteredEssays.length;

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm transition-all p-4"
            onClick={() => setOpen(false)}
        >
            <div
                className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[60vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center border-b border-zinc-100 dark:border-zinc-800 px-4">
                    <Search className="mr-2 h-5 w-5 opacity-50 shrink-0" />
                    <input
                        className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-50"
                        placeholder="搜索文章和随笔..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-zinc-100 px-1.5 font-mono text-[10px] font-medium text-zinc-500 opacity-100 dark:bg-zinc-800 shrink-0">
                        <span className="text-xs">ESC</span>
                    </kbd>
                </div>

                <div className="overflow-y-auto p-2">
                    {totalResults === 0 ? (
                        <div className="py-6 text-center text-sm text-zinc-500">
                            未找到相关结果
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {/* 技术博客结果 */}
                            {filteredPosts.length > 0 && (
                                <>
                                    <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                                        技术博客
                                    </div>
                                    {filteredPosts.slice(0, 5).map((post) => (
                                        <div
                                            key={post.slug}
                                            onClick={() => {
                                                setOpen(false);
                                                router.push(`/blog/${post.slug}`);
                                            }}
                                            className="flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            <BookOpen className="mr-2 h-4 w-4 opacity-50 shrink-0" />
                                            <span className="flex-1 truncate">{post.title}</span>
                                            {post.tags[0] && (
                                                <span className="ml-auto text-xs text-zinc-400 capitalize bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded shrink-0">
                                                    {post.tags[0]}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* 生活随笔结果 */}
                            {filteredEssays.length > 0 && (
                                <>
                                    <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mt-1">
                                        生活随笔
                                    </div>
                                    {filteredEssays.slice(0, 5).map((essay) => (
                                        <div
                                            key={essay.slug}
                                            onClick={() => {
                                                setOpen(false);
                                                router.push(`/essays/${essay.slug}`);
                                            }}
                                            className="flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            <Feather className="mr-2 h-4 w-4 opacity-50 shrink-0" />
                                            <span className="flex-1 truncate">{essay.title}</span>
                                            {essay.tags[0] && (
                                                <span className="ml-auto text-xs text-zinc-400 capitalize bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded shrink-0">
                                                    {essay.tags[0]}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
