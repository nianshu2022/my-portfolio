import { getAllPostSummaries, getAllEssaySummaries } from "@/lib/posts";
import Link from "next/link";
import FloatingNav from "@/components/FloatingNav";
import ScrollReveal from "@/components/ScrollReveal";
import { Archive, BookOpen, Feather } from "lucide-react";
import SiteStats from "@/components/SiteStats";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "时间索引",
    description: "按时间线索引念舒档案局的技术案卷和成长样本。",
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
        <main className="archive-shell max-w-6xl">
            <FloatingNav backUrl="/" />

            <header className="mb-8 border-y border-foreground/80 py-8 sm:mb-10">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="inline-flex items-center gap-2 border border-primary px-2 py-1 font-mono text-sm font-bold text-primary">
                            <Archive className="h-4 w-4" />
                            TIME INDEX
                        </p>
                        <h1 className="mt-5 text-[clamp(3rem,8vw,5.8rem)] font-black leading-none tracking-normal text-foreground">
                            时间索引
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                            按年份和日期检索技术案卷、成长样本，快速回到某一次折腾、复盘或阶段记录。
                        </p>
                    </div>
                    <dl className="grid min-w-56 border border-foreground/50 bg-card/80 font-mono text-xs">
                        <div className="grid grid-cols-[5rem_1fr] border-b border-border px-4 py-2">
                            <dt className="text-muted-foreground">记录</dt>
                            <dd className="font-bold text-foreground">{allItems.length} 份</dd>
                        </div>
                        <div className="grid grid-cols-[5rem_1fr] border-b border-border px-4 py-2">
                            <dt className="text-muted-foreground">跨度</dt>
                            <dd className="font-bold text-foreground">{years.length} 年</dd>
                        </div>
                        <div className="grid grid-cols-[5rem_1fr] px-4 py-2">
                            <dt className="text-muted-foreground">状态</dt>
                            <dd className="text-primary">持续归档</dd>
                        </div>
                    </dl>
                </div>
            </header>

            <ScrollReveal delay={0.1}>
              <div className="mb-10 border-b border-border pb-8">
                <SiteStats />
              </div>
            </ScrollReveal>

            <div className="relative">
                {years.map((year, yIdx) => (
                    <ScrollReveal key={year} delay={yIdx * 0.1}>
                        <section className="mb-8 grid gap-4 border-b border-foreground/70 pb-8 sm:mb-12 sm:grid-cols-[8rem_1fr]">
                            <div className="font-mono">
                                <h2 className="text-4xl font-black text-primary sm:text-5xl">
                                    {year}
                                </h2>
                                <span className="mt-2 block text-xs text-muted-foreground">{byYear.get(year)!.length} 份记录</span>
                            </div>

                            <div className="border-y border-border">
                                {byYear.get(year)!.map((item, idx) => (
                                    <ScrollReveal key={item.slug} delay={idx * 0.04} className="min-w-0">
                                        <Link
                                            href={item.type === "post" ? `/blog/${item.slug}` : `/essays/${item.slug}`}
                                            className="group grid w-full max-w-full gap-3 overflow-hidden border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-secondary/70 sm:grid-cols-[4rem_4rem_1fr] sm:items-center"
                                        >
                                            <span className="font-mono text-sm text-muted-foreground">
                                                {item.date.slice(5)}
                                            </span>
                                            <span className="inline-flex w-fit items-center gap-1 border border-primary px-1.5 py-1 text-xs font-semibold text-primary">
                                                {item.type === "post"
                                                    ? <BookOpen className="h-3.5 w-3.5" />
                                                    : <Feather className="h-3.5 w-3.5" />
                                                }
                                                {item.type === "post" ? "案卷" : "样本"}
                                            </span>
                                            <div className="min-w-0 flex-1 overflow-hidden">
                                                <h3 className="max-w-full truncate text-lg font-black text-foreground transition-colors group-hover:text-primary">
                                                    {item.title}
                                                </h3>
                                                {item.tags.length > 0 && (
                                                    <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                                                        {item.tags.slice(0, 4).join(" · ")}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    </ScrollReveal>
                                ))}
                            </div>
                        </section>
                    </ScrollReveal>
                ))}
            </div>
        </main>
    );
}
