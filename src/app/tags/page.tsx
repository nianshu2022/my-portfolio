import { getAllPostSummaries, getAllEssaySummaries } from "@/lib/posts";
import Link from "next/link";
import FloatingNav from "@/components/FloatingNav";
import { Tag, Hash } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "标签 | 念舒",
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
        <main className="min-h-screen pt-24 pb-20 px-6 sm:px-12 max-w-5xl mx-auto font-sans">
            {/* Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-200/30 dark:bg-violet-900/10 rounded-full blur-[100px] opacity-70" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-teal-200/30 dark:bg-teal-900/10 rounded-full blur-[100px] opacity-70" />
            </div>

            <FloatingNav backUrl="/" />

            {/* Header */}
            <header className="mb-12 text-center animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm font-medium mb-4 border border-zinc-200 dark:border-zinc-700">
                    <Tag className="w-4 h-4" />
                    <span>标签云</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 font-serif mb-4">
                    所有标签
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400">
                    共 <span className="font-bold text-zinc-700 dark:text-zinc-200">{tags.length}</span> 个标签，
                    <span className="font-bold text-zinc-700 dark:text-zinc-200">{posts.length + essays.length}</span> 篇内容
                </p>
            </header>

            {/* Tag Cloud */}
            <section className="mb-16 p-8 rounded-3xl bg-white/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                <div className="flex flex-wrap gap-3 justify-center">
                    {tags.map((tag, idx) => {
                        const ratio = tag.total / maxCount;
                        const size = ratio > 0.7 ? "text-2xl font-bold" : ratio > 0.4 ? "text-lg font-semibold" : "text-sm font-medium";
                        const opacity = ratio > 0.6 ? "opacity-100" : ratio > 0.3 ? "opacity-80" : "opacity-60";
                        return (
                            <Link
                                key={tag.name}
                                href={`/blog?tag=${encodeURIComponent(tag.name)}`}
                                className={`group inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/80 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-300 text-zinc-700 dark:text-zinc-300 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${size} ${opacity}`}
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

            {/* Tag List Table */}
            <section className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-6 flex items-center gap-2">
                    <span className="w-1 h-5 bg-violet-500 rounded-full" />
                    标签详情
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tags.map((tag, idx) => (
                        <Link
                            key={tag.name}
                            href={`/blog?tag=${encodeURIComponent(tag.name)}`}
                            className="group flex items-center justify-between p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-700/50 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/50 dark:hover:bg-violet-900/20 transition-all duration-200 hover:shadow-md"
                            style={{ animationDelay: `${200 + idx * 20}ms` }}
                        >
                            <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-violet-500 opacity-70 group-hover:opacity-100" />
                                <span className="font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                                    {tag.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                                {tag.posts > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                        博客 {tag.posts}
                                    </span>
                                )}
                                {tag.essays > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
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
