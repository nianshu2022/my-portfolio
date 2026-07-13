import { getAllPostSummaries, getAllEssaySummaries } from "@/lib/posts";
import Link from "next/link";
import FloatingNav from "@/components/FloatingNav";
import ScrollReveal from "@/components/ScrollReveal";
import { BookOpen, Feather } from "lucide-react";
import SiteStats from "@/components/SiteStats";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "归档",
  description: "按时间线浏览念舒所有的博客文章和个人随笔。",
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
    <main className="ns-shell">
      <FloatingNav backUrl="/" />

      {/* ── Page Header ── */}
      <header className="mb-10 border-b border-border pb-10">
        <p className="mb-3 text-sm font-semibold text-primary">✦ 时间线</p>
        <h1 className="text-5xl font-black leading-tight tracking-tight text-foreground sm:text-6xl">
          <span className="gradient-text">归档</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          按年份浏览所有的技术文章和个人随笔，快速回到某一次折腾或阶段记录。
        </p>

        {/* Stats row */}
        <div className="mt-8 flex flex-wrap gap-4">
          <div className="rounded-xl border border-border bg-card px-5 py-3 text-center">
            <p className="text-2xl font-black text-foreground">{allItems.length}</p>
            <p className="text-xs text-muted-foreground">总记录</p>
          </div>
          <div className="rounded-xl border border-border bg-card px-5 py-3 text-center">
            <p className="text-2xl font-black text-foreground">{years.length}</p>
            <p className="text-xs text-muted-foreground">跨越年份</p>
          </div>
          <div className="rounded-xl border border-border bg-card px-5 py-3 text-center">
            <p className="text-2xl font-black text-primary">持续更新</p>
            <p className="text-xs text-muted-foreground">状态</p>
          </div>
        </div>
      </header>

      {/* ── Site Stats ── */}
      <ScrollReveal delay={0.05}>
        <div className="mb-10 rounded-2xl border border-border bg-card p-6">
          <SiteStats />
        </div>
      </ScrollReveal>

      {/* ── Timeline by Year ── */}
      <div className="space-y-10">
        {years.map((year, yIdx) => (
          <ScrollReveal key={year} delay={yIdx * 0.08}>
            <section className="grid gap-6 sm:grid-cols-[7rem_1fr]">
              {/* Year heading */}
              <div className="flex flex-col gap-1">
                <h2 className="text-5xl font-black text-primary sm:text-6xl">{year}</h2>
                <span className="text-xs font-medium text-muted-foreground">
                  {byYear.get(year)!.length} 篇
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {byYear.get(year)!.map((item, idx) => (
                  <ScrollReveal key={item.slug} delay={idx * 0.03} className="min-w-0">
                    <Link
                      href={item.type === "post" ? `/blog/${item.slug}` : `/essays/${item.slug}`}
                      className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
                    >
                      {/* Date */}
                      <time className="w-12 flex-shrink-0 text-xs font-medium text-muted-foreground">
                        {item.date.slice(5)}
                      </time>

                      {/* Type badge */}
                      <span
                        className={`inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          item.type === "post"
                            ? "bg-primary/10 text-primary"
                            : "bg-accent text-accent-foreground"
                        }`}
                      >
                        {item.type === "post"
                          ? <BookOpen className="h-3 w-3" />
                          : <Feather className="h-3 w-3" />
                        }
                        {item.type === "post" ? "文章" : "随笔"}
                      </span>

                      {/* Title */}
                      <span className="min-w-0 flex-1 truncate font-semibold text-foreground transition-colors group-hover:text-primary">
                        {item.title}
                      </span>

                      {/* Tags (desktop) */}
                      {item.tags.length > 0 && (
                        <span className="hidden flex-shrink-0 text-xs text-muted-foreground sm:block">
                          {item.tags.slice(0, 2).join(" · ")}
                        </span>
                      )}
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
