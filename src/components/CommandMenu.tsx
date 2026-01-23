"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Search, FileText } from "lucide-react";
import { PostSummary } from "@/lib/posts";

interface CommandMenuProps {
    posts: PostSummary[];
}

export default function CommandMenu({ posts }: CommandMenuProps) {
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
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [open]);

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm transition-all p-4">
            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[60vh]">
                <div className="flex items-center border-b border-zinc-100 dark:border-zinc-800 px-4">
                    <Search className="mr-2 h-5 w-5 opacity-50" />
                    <input
                        className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-50"
                        placeholder="搜索文章..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-zinc-100 px-1.5 font-mono text-[10px] font-medium text-zinc-500 opacity-100 dark:bg-zinc-800">
                        <span className="text-xs">ESC</span>
                    </kbd>
                </div>

                <div className="overflow-y-auto p-2">
                    {filteredPosts.length === 0 ? (
                        <div className="py-6 text-center text-sm text-zinc-500">
                            No results found.
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredPosts.slice(0, 10).map((post) => (
                                <div
                                    key={post.slug}
                                    onClick={() => {
                                        setOpen(false);
                                        router.push(`/blog/${post.slug}`);
                                    }}
                                    className="flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <BookOpen className="mr-2 h-4 w-4 opacity-50" />
                                    <span className="flex-1 truncate">{post.title}</span>
                                    {post.tags[0] && (
                                        <span className="ml-auto text-xs text-zinc-400 capitalize bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                                            {post.tags[0]}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Backdrop click to close */}
                <div className="absolute inset-0 -z-10" onClick={() => setOpen(false)} />
            </div>
            {/* Full screen backdrop for click outside */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
        </div>
    );
}
