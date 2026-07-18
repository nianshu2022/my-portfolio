import { getAllPostSummaries, getAllEssaySummaries } from "@/lib/posts";
import Link from "next/link";
import FloatingNav from "@/components/FloatingNav";
import { Hash } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "标签",
  description: "按标签浏览念舒的博客文章和个人随笔。",
};

export default function TagsPage() {
  const posts = getAllPostSummaries();
  const essays = getAllEssaySummaries();

  // Collect all tags with counts
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

  const tags = Array.from(tagMap.entries())
    .map(([name, counts]) => ({ name, total: counts.posts + counts.essays, ...counts }))
    .sort((a, b) => b.total - a.total);

  const maxCount = tags[0]?.total ?? 1;

  return (
    <main className="ns-shell">
      <FloatingNav backUrl="/" />

      {/* ── Page Header ── */}
      <header className="mb-10 border-b border-border pb-10">
        <p className="mb-3 text-sm font-semibold text-primary">主题导航</p>
        <h1 className="text-5xl font-black leading-tight tracking-tight text-foreground sm:text-6xl">
          <span className="gradient-text">标签</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          共 <strong className="text-foreground">{tags.length}</strong> 个标签，
          关联 <strong className="text-foreground">{posts.length + essays.length}</strong> 篇内容。
          用主题词快速进入对应文章。
        </p>
      </header>

      {/* ── Tag Cloud ── */}
      <section className="mb-10">
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground">标签云</h2>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const ratio = tag.total / maxCount;
              const size =
                ratio > 0.8
                  ? "text-xl font-bold"
                  : ratio > 0.6
                  ? "text-lg font-bold"
                  : ratio > 0.4
                  ? "text-base font-semibold"
                  : ratio > 0.2
                  ? "text-sm font-medium"
                  : "text-xs font-medium";
              const opacity =
                ratio > 0.6 ? "opacity-100" : ratio > 0.3 ? "opacity-75" : "opacity-50";
              return (
                <Link
                  key={tag.name}
                  href={`/blog?tag=${encodeURIComponent(tag.name)}`}
                  className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-foreground transition-all hover:border-primary hover:text-primary ${size} ${opacity}`}
                >
                  <Hash className="h-3 w-3 opacity-60" />
                  {tag.name}
                  <span className="rounded-full bg-background px-1.5 py-0.5 text-xs font-normal text-muted-foreground">
                    {tag.total}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Tag List ── */}
      <section>
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground">全部标签</h2>
        <div className="space-y-2">
          {tags.map((tag, idx) => (
            <Link
              key={tag.name}
              href={`/blog?tag=${encodeURIComponent(tag.name)}`}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
            >
              <Hash className="h-4 w-4 flex-shrink-0 text-primary/60 group-hover:text-primary" />
              <span className="flex-1 font-semibold text-foreground group-hover:text-primary transition-colors">
                {tag.name}
              </span>
              <div className="flex items-center gap-2">
                {tag.posts > 0 && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    文章 {tag.posts}
                  </span>
                )}
                {tag.essays > 0 && (
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
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
