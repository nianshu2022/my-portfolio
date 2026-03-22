"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Search, Feather, ArrowRight, Tag, Archive, Users } from "lucide-react";
import { PostSummary } from "@/lib/posts";

interface CommandMenuProps {
    posts: PostSummary[];
    essays: PostSummary[];
}

export default function CommandMenu({ posts, essays }: CommandMenuProps) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [activeIndex, setActiveIndex] = React.useState(0);
    const inputRef = React.useRef<HTMLInputElement>(null);

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

    // 打开时自动聚焦输入框，重置状态
    React.useEffect(() => {
        if (open) {
            setQuery("");
            setActiveIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
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

    // 合并所有结果用于键盘导航
    type ItemEntry = { item: PostSummary; type: "post" | "essay" };
    const allResults: ItemEntry[] = [
        ...filteredPosts.slice(0, 5).map((item) => ({ item, type: "post" as const })),
        ...filteredEssays.slice(0, 5).map((item) => ({ item, type: "essay" as const })),
    ];

    const totalResults = allResults.length;

    const navigate = (entry: ItemEntry) => {
        setOpen(false);
        router.push(entry.type === "post" ? `/blog/${entry.item.slug}` : `/essays/${entry.item.slug}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => (i + 1) % Math.max(totalResults, 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => (i - 1 + Math.max(totalResults, 1)) % Math.max(totalResults, 1));
        } else if (e.key === "Enter" && allResults[activeIndex]) {
            navigate(allResults[activeIndex]);
        }
    };

    // 查询变化时重置选中index
    React.useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    if (!open) return null;

    let globalIdx = 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[18vh] bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
        >
            <div
                className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[65vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center border-b border-zinc-100 dark:border-zinc-800 px-4">
                    <Search className="mr-3 h-4 w-4 opacity-40 shrink-0" />
                    <input
                        ref={inputRef}
                        className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-zinc-400 dark:text-zinc-50"
                        placeholder="搜索文章和随笔..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-zinc-100 dark:bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-400 shrink-0">
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div className="overflow-y-auto p-2">
                    {totalResults === 0 ? (
                        <div className="py-8 text-center text-sm text-zinc-400">
                            {query ? `未找到"${query}"相关内容` : "输入关键词搜索…"}
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {/* 技术博客 */}
                            {filteredPosts.length > 0 && (
                                <>
                                    <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                                        技术博客
                                    </div>
                                    {filteredPosts.slice(0, 5).map((post) => {
                                        const idx = globalIdx++;
                                        const isActive = idx === activeIndex;
                                        return (
                                            <div
                                                key={post.slug}
                                                onClick={() => navigate({ item: post, type: "post" })}
                                                onMouseEnter={() => setActiveIndex(idx)}
                                                className={`flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${isActive
                                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                    }`}
                                            >
                                                <BookOpen className={`mr-2.5 h-4 w-4 shrink-0 ${isActive ? "text-blue-500" : "opacity-40"}`} />
                                                <span className="flex-1 truncate">{post.title}</span>
                                                {post.tags[0] && (
                                                    <span className="ml-2 text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded shrink-0">
                                                        {post.tags[0]}
                                                    </span>
                                                )}
                                                {isActive && <ArrowRight className="ml-2 h-3.5 w-3.5 text-blue-400 shrink-0" />}
                                            </div>
                                        );
                                    })}
                                </>
                            )}

                            {/* 生活随笔 */}
                            {filteredEssays.length > 0 && (
                                <>
                                    <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mt-1">
                                        生活随笔
                                    </div>
                                    {filteredEssays.slice(0, 5).map((essay) => {
                                        const idx = globalIdx++;
                                        const isActive = idx === activeIndex;
                                        return (
                                            <div
                                                key={essay.slug}
                                                onClick={() => navigate({ item: essay, type: "essay" })}
                                                onMouseEnter={() => setActiveIndex(idx)}
                                                className={`flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${isActive
                                                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                                                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                    }`}
                                            >
                                                <Feather className={`mr-2.5 h-4 w-4 shrink-0 ${isActive ? "text-purple-500" : "opacity-40"}`} />
                                                <span className="flex-1 truncate">{essay.title}</span>
                                                {essay.tags[0] && (
                                                    <span className="ml-2 text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded shrink-0">
                                                        {essay.tags[0]}
                                                    </span>
                                                )}
                                                {isActive && <ArrowRight className="ml-2 h-3.5 w-3.5 text-purple-400 shrink-0" />}
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Page shortcuts */}
                <div className="border-t border-zinc-100 dark:border-zinc-800 p-2">
                    <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        快速导航
                    </div>
                    <div className="flex flex-wrap gap-1 px-1">
                        {[{ href: "/tags", icon: Tag, label: "标签" }, { href: "/archive", icon: Archive, label: "归档" }, { href: "/friends", icon: Users, label: "友链" }]
                            .map(({ href, icon: Icon, label }) => (
                                <button
                                    key={href}
                                    onClick={() => { setOpen(false); router.push(href); }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {label}
                                </button>
                            ))}
                    </div>
                </div>

                {/* Footer hint */}
                <div className="border-t border-zinc-100 dark:border-zinc-800 px-4 py-2 flex items-center gap-3 text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1">
                        <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">↑</kbd>
                        <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">↓</kbd>
                        导航
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">↵</kbd>
                        打开
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">ESC</kbd>
                        关闭
                    </span>
                </div>
            </div>
        </div>
    );
}
