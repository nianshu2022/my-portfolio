import { getAllPostSummaries, getAllEssaySummaries } from "@/lib/posts";
import Link from "next/link";
import FloatingNav from "@/components/FloatingNav";
import { Tag, Hash } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "标签",
    description: "按标签浏览所有博客文章和生活随笔。",
};

export default function TagsPage() {
    const posts = getAllPostSummaries();
    const essays = getAllEssaySummaries();

    // Collect all tags with counts and sources
    const tagMap = new Map<string, { posts: number; essays: number }>();

    posts.forEach((post) => {
        post.tags?.forEach((tag) => {
            const prev = tagMap.get(tag) ?? { posts: 0, essays: 0 };
            tagMap.set(tag, { ...prev, posts: prev.posts + 1 });
        });
    });
    essays.forEach((essay) => {
        essay.tags?.forEach((tag) => {
            const prev = tagMap.get(tag) ?? { posts: 0, essays: 0 };
            tagMap.set(tag, { ...prev, essays: prev.essays + 1 });
        });
    });

    // Sort by total count desc
    const tags = Array.from(tagMap.entries())
        .map(([name, counts]) => ({ name, total: counts.posts + counts.essays, ...counts }))
        .sort((a, b) => b.total - a.total);

    const maxCount = tags[0]?.total ?? 1;

    return (
        <main className="garden-shell">
            <FloatingNav backUrl="/" />

            <header className="mb-10 border-b border-border pb-8">
                <p className="garden-kicker inline-flex items-center gap-2"><Tag className="h-4 w-4" /> 标签索引</p>
                <h1 className="garden-title mt-3">所有标签</h1>
                <p className="garden-subtitle mt-3">
                    共 <span className="font-bold text-zinc-700 dark:text-zinc-200">{tags.length}</span> 个标签，
                    <span className="font-bold text-zinc-700 dark:text-zinc-200">{posts.length + essays.length}</span> 篇内容
                </p>
            </header>

            <section className="garden-panel mb-10 p-5" style={{ animationDelay: "100ms" }}>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => {
                        const ratio = tag.total / maxCount;
                        const size = ratio > 0.8 ? "text-xl font-bold" : ratio > 0.6 ? "text-lg font-bold" : ratio > 0.4 ? "text-base font-semibold" : ratio > 0.2 ? "text-sm font-medium" : "text-xs font-medium";
                        const opacity = ratio > 0.6 ? "opacity-100" : ratio > 0.3 ? "opacity-80" : "opacity-60";
                        return (
                            <Link
                                key={tag.name}
                                href={`/search?q=${encodeURIComponent(tag.name)}`}
                                className={`group inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-zinc-700 transition-colors hover:bg-secondary dark:text-zinc-300 ${size} ${opacity}`}
                                style={{ animationDelay: `${idx * 30}ms` }}
                            >
                                <Hash className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                                {tag.name}
                                <span className="ml-1 text-xs font-normal px-1.5 py-0.5 rounded-full bg-zinc-200/70 dark:bg-zinc-700/70 text-zinc-500 dark:text-zinc-400">
                                    {tag.total}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <h2 className="mb-4 text-xl font-bold text-zinc-800 dark:text-zinc-200">
                    标签详情
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tags.map((tag, idx) => (
                        <Link
                            key={tag.name}
                            href={`/blog?tag=${encodeURIComponent(tag.name)}`}
                            className="garden-panel group flex items-center justify-between p-4 transition-colors hover:bg-secondary"
                            style={{ animationDelay: `${200 + idx * 20}ms` }}
                        >
                            <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-indigo-500 opacity-70 group-hover:opacity-100" />
                                <span className="font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {tag.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                                {tag.posts > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-secondary text-primary">
                                        博客 {tag.posts}
                                    </span>
                                )}
                                {tag.essays > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-secondary text-primary">
                                        随笔 {tag.essays}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
