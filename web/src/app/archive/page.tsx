import { getAllPostSummaries, getAllEssaySummaries } from "@/lib/posts";
import Link from "next/link";
import FloatingNav from "@/components/FloatingNav";
import ScrollReveal from "@/components/ScrollReveal";
import { Archive, BookOpen, Feather } from "lucide-react";
import SiteStats from "@/components/SiteStats";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "归档",
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
        <main className="garden-shell max-w-4xl">
            <FloatingNav backUrl="/" />

            <header className="mb-8 border-b border-border pb-6 sm:mb-10 sm:pb-8">
                <p className="garden-kicker inline-flex items-center gap-2"><Archive className="h-4 w-4" /> 时间线</p>
                <h1 className="garden-title mt-3">文章归档</h1>
                <p className="garden-subtitle mt-3">
                    共 <span className="font-bold text-zinc-700 dark:text-zinc-200">{allItems.length}</span> 篇内容，
                    跨越 <span className="font-bold text-zinc-700 dark:text-zinc-200">{years.length}</span> 年
                </p>
            </header>

            <ScrollReveal delay={0.1}>
              <div className="mb-10">
                <SiteStats />
              </div>
            </ScrollReveal>

            <div className="relative">
                {years.map((year, yIdx) => (
                    <ScrollReveal key={year} delay={yIdx * 0.1}>
                        <div className="mb-8 sm:mb-12">
                            <div className="mb-3 flex items-baseline justify-between border-b border-border pb-2 sm:mb-4 sm:pb-3">
                                <h2 className="text-xl font-bold sm:text-2xl">
                                    {year}
                                </h2>
                                <span className="text-sm text-muted-foreground">{byYear.get(year)!.length} 篇</span>
                            </div>

                            <div className="grid gap-2">
                                {byYear.get(year)!.map((item, idx) => (
                                    <ScrollReveal key={item.slug} delay={idx * 0.04} className="min-w-0">
                                        <Link
                                            href={item.type === "post" ? `/blog/${item.slug}` : `/essays/${item.slug}`}
                                            className="garden-panel group flex w-full max-w-full items-start gap-3 overflow-hidden p-3 transition-all hover:border-primary/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] sm:gap-4 sm:p-4"
                                        >
                                            <div className="shrink-0 mt-0.5">
                                                {item.type === "post"
                                                    ? <BookOpen className="w-4 h-4 text-primary" />
                                                    : <Feather className="w-4 h-4 text-primary" />
                                                }
                                            </div>
                                            <div className="min-w-0 flex-1 overflow-hidden">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 shrink-0">
                                                        {item.date.slice(5)}
                                                    </span>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${item.type === "post"
                                                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                                                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                        }`}>
                                                        {item.type === "post" ? "博客" : "随笔"}
                                                    </span>
                                                </div>
                                                <h3 className="max-w-full truncate font-semibold text-zinc-800 transition-colors group-hover:text-indigo-600 dark:text-zinc-200 dark:group-hover:text-indigo-400">
                                                    {item.title}
                                                </h3>
                                            </div>
                                        </Link>
                                    </ScrollReveal>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        </main>
    );
}
