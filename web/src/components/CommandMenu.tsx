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

    // Focus trap
    const containerRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (!open) return;
        const container = containerRef.current;
        if (!container) return;
        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;
            const focusable = container.querySelectorAll<HTMLElement>(
                'input, button, [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", handleTab);
        return () => document.removeEventListener("keydown", handleTab);
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

    const navigateToSearchPage = () => {
        const q = query.trim();
        setOpen(false);
        router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => (i + 1) % Math.max(totalResults, 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => (i - 1 + Math.max(totalResults, 1)) % Math.max(totalResults, 1));
        } else if (e.key === "Enter") {
            if (allResults[activeIndex]) {
                navigate(allResults[activeIndex]);
                return;
            }
            navigateToSearchPage();
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
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 p-4 pt-[16vh] backdrop-blur-sm"
            onClick={() => setOpen(false)}
        >
            <div
                ref={containerRef}
                role="dialog"
                aria-modal="true"
                aria-label="档案检索面板"
                className="relative flex max-h-[68vh] w-full max-w-2xl flex-col overflow-hidden border border-foreground/60 bg-card/95 shadow-2xl backdrop-blur-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center border-b border-foreground/40 px-4">
                    <Search className="mr-3 h-4 w-4 shrink-0 text-primary" />
                    <input
                        ref={inputRef}
                        className="flex h-12 w-full bg-transparent py-3 font-mono text-sm outline-none placeholder:text-muted-foreground"
                        placeholder="检索案卷、样本或标签..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <kbd className="pointer-events-none inline-flex h-5 shrink-0 select-none items-center gap-1 border border-border bg-secondary px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div className="overflow-y-auto p-2">
                    {totalResults === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            {query ? `未找到「${query}」相关档案` : "输入关键词开始检索"}
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {/* 技术博客 */}
                            {filteredPosts.length > 0 && (
                                <>
                                    <div className="px-2 py-1.5 font-mono text-[10px] font-semibold text-muted-foreground">
                                        技术案卷
                                    </div>
                                    {filteredPosts.slice(0, 5).map((post) => {
                                        const idx = globalIdx++;
                                        const isActive = idx === activeIndex;
                                        return (
                                            <div
                                                key={post.slug}
                                                onClick={() => navigate({ item: post, type: "post" })}
                                                onMouseEnter={() => setActiveIndex(idx)}
                                                className={`flex cursor-pointer select-none items-center border px-3 py-2.5 text-sm outline-none transition-colors ${isActive
                                                    ? "border-primary bg-accent text-primary"
                                                    : "border-transparent hover:border-border hover:bg-secondary"
                                                    }`}
                                            >
                                                <BookOpen className={`mr-2.5 h-4 w-4 shrink-0 ${isActive ? "text-primary" : "opacity-40"}`} />
                                                <span className="flex-1 truncate">{post.title}</span>
                                                {post.tags[0] && (
                                                    <span className="ml-2 shrink-0 border border-border bg-background px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                                                        {post.tags[0]}
                                                    </span>
                                                )}
                                                {isActive && <ArrowRight className="ml-2 h-3.5 w-3.5 text-primary shrink-0" />}
                                            </div>
                                        );
                                    })}
                                </>
                            )}

                            {/* 生活随笔 */}
                            {filteredEssays.length > 0 && (
                                <>
                                    <div className="mt-1 px-2 py-1.5 font-mono text-[10px] font-semibold text-muted-foreground">
                                        成长样本
                                    </div>
                                    {filteredEssays.slice(0, 5).map((essay) => {
                                        const idx = globalIdx++;
                                        const isActive = idx === activeIndex;
                                        return (
                                            <div
                                                key={essay.slug}
                                                onClick={() => navigate({ item: essay, type: "essay" })}
                                                onMouseEnter={() => setActiveIndex(idx)}
                                                className={`flex cursor-pointer select-none items-center border px-3 py-2.5 text-sm outline-none transition-colors ${isActive
                                                    ? "border-primary bg-accent text-primary"
                                                    : "border-transparent hover:border-border hover:bg-secondary"
                                                    }`}
                                            >
                                                <Feather className={`mr-2.5 h-4 w-4 shrink-0 ${isActive ? "text-primary" : "opacity-40"}`} />
                                                <span className="flex-1 truncate">{essay.title}</span>
                                                {essay.tags[0] && (
                                                    <span className="ml-2 shrink-0 border border-border bg-background px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                                                        {essay.tags[0]}
                                                    </span>
                                                )}
                                                {isActive && <ArrowRight className="ml-2 h-3.5 w-3.5 text-primary shrink-0" />}
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t border-border px-3 py-2">
                    <button
                        onClick={navigateToSearchPage}
                        className="w-full border border-transparent px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-border hover:bg-secondary hover:text-foreground"
                    >
                        {query ? `查看「${query}」的全部检索结果` : "进入完整检索台"}
                    </button>
                </div>

                {/* Page shortcuts */}
                <div className="border-t border-border p-2">
                    <div className="px-2 py-1.5 font-mono text-[10px] font-semibold text-muted-foreground">
                        快速导航
                    </div>
                    <div className="flex flex-wrap gap-1 px-1">
                        {[{ href: "/tags", icon: Tag, label: "标签" }, { href: "/archive", icon: Archive, label: "归档" }, { href: "/friends", icon: Users, label: "友链" }]
                            .map(({ href, icon: Icon, label }) => (
                                <button
                                    key={href}
                                    onClick={() => { setOpen(false); router.push(href); }}
                                    className="flex items-center gap-1.5 border border-transparent px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border hover:bg-secondary hover:text-foreground"
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {label}
                                </button>
                            ))}
                    </div>
                </div>

                {/* Footer hint */}
                <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <kbd className="border border-border bg-secondary px-1 py-0.5 font-mono">↑</kbd>
                        <kbd className="border border-border bg-secondary px-1 py-0.5 font-mono">↓</kbd>
                        导航
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="border border-border bg-secondary px-1 py-0.5 font-mono">↵</kbd>
                        打开
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="border border-border bg-secondary px-1 py-0.5 font-mono">ESC</kbd>
                        关闭
                    </span>
                </div>
            </div>
        </div>
    );
}
