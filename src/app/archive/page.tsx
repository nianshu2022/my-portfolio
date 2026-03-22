import { getAllPostSummaries, getAllEssaySummaries } from "@/lib/posts";
import Link from "next/link";
import FloatingNav from "@/components/FloatingNav";
import { Archive, BookOpen, Feather } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "归档 | 念舒",
    description: "按时间线归档所有博客文章和生活随笔。",
};

type ArchiveItem = {
    slug: string;
    title: string;
    date: string;
    type: "post" | "essay";
    tags: string[];
};

export default function ArchivePage() {
    const posts = getAllPostSummaries();
    const essays = getAllEssaySummaries();

    const allItems: ArchiveItem[] = [
        ...posts.map((p) => ({ slug: p.slug, title: p.title, date: p.date, type: "post" as const, tags: p.tags ?? [] })),
        ...essays.map((e) => ({ slug: e.slug, title: e.title, date: e.date, type: "essay" as const, tags: e.tags ?? [] })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Group by year
    const byYear = new Map<string, ArchiveItem[]>();
    allItems.forEach((item) => {
        const year = item.date.slice(0, 4);
        if (!byYear.has(year)) byYear.set(year, []);
        byYear.get(year)!.push(item);
    });

    const years = Array.from(byYear.keys()).sort((a, b) => Number(b) - Number(a));

    return (
        <main className="min-h-screen pt-24 pb-20 px-6 sm:px-12 max-w-3xl mx-auto font-sans">
            {/* Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-amber-200/30 dark:bg-amber-900/10 rounded-full blur-[100px] opacity-70" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-rose-200/30 dark:bg-rose-900/10 rounded-full blur-[100px] opacity-70" />
            </div>

            <FloatingNav backUrl="/" />

            {/* Header */}
            <header className="mb-12 text-center animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm font-medium mb-4 border border-zinc-200 dark:border-zinc-700">
                    <Archive className="w-4 h-4" />
                    <span>时间线</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 font-serif mb-4">
                    文章归档
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400">
                    共 <span className="font-bold text-zinc-700 dark:text-zinc-200">{allItems.length}</span> 篇内容，
                    跨越 <span className="font-bold text-zinc-700 dark:text-zinc-200">{years.length}</span> 年
                </p>
            </header>

            {/* Timeline */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                {/* Vertical line */}
                <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-amber-400/60 via-zinc-300/40 to-transparent dark:from-amber-500/40 dark:via-zinc-700/40 hidden sm:block" />

                {years.map((year, yIdx) => (
                    <div key={year} className="mb-12">
                        {/* Year Label */}
                        <div className="flex items-center gap-4 mb-6" style={{ animationDelay: `${yIdx * 50}ms` }}>
                            <div className="hidden sm:flex w-8 h-8 rounded-full bg-amber-400 dark:bg-amber-500 items-center justify-center shrink-0 shadow-md shadow-amber-400/30 z-10">
                                <span className="sr-only">{year}</span>
                            </div>
                            <h2 className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-200 font-serif sm:ml-0">
                                {year}
                                <span className="ml-3 text-sm font-normal text-zinc-400 dark:text-zinc-500">
                                    {byYear.get(year)!.length} 篇
                                </span>
                            </h2>
                        </div>

                        {/* Items */}
                        <div className="sm:ml-12 space-y-3">
                            {byYear.get(year)!.map((item, idx) => (
                                <Link
                                    key={item.slug}
                                    href={item.type === "post" ? `/blog/${item.slug}` : `/essays/${item.slug}`}
                                    className="group flex items-start gap-4 p-4 rounded-2xl bg-white/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-700/50 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-all duration-200 hover:shadow-md hover:-translate-x-1"
                                    style={{ animationDelay: `${yIdx * 50 + idx * 20}ms` }}
                                >
                                    <div className="shrink-0 mt-0.5">
                                        {item.type === "post"
                                            ? <BookOpen className="w-4 h-4 text-blue-500" />
                                            : <Feather className="w-4 h-4 text-purple-500" />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 shrink-0">
                                                {item.date.slice(5)} {/* MM-DD */}
                                            </span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${item.type === "post"
                                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                                }`}>
                                                {item.type === "post" ? "博客" : "随笔"}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors truncate">
                                            {item.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
