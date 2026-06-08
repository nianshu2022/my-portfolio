import { getAllPostSummaries, getAllEssaySummaries } from "@/lib/posts";
import Link from "next/link";
import FloatingNav from "@/components/FloatingNav";
import { Tag, Hash } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "标签索引",
    description: "按标签检索念舒档案局的技术案卷和成长样本。",
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
        <main className="archive-shell max-w-6xl">
            <FloatingNav backUrl="/" />

            <header className="mb-10 border-y border-foreground/80 py-8">
                <p className="inline-flex items-center gap-2 border border-primary px-2 py-1 font-mono text-sm font-bold text-primary">
                    <Tag className="h-4 w-4" />
                    TAG INDEX
                </p>
                <h1 className="mt-5 text-[clamp(3rem,8vw,5.8rem)] font-black leading-none tracking-normal text-foreground">
                    标签索引
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                    共 <span className="font-bold text-foreground">{tags.length}</span> 个标签，
                    关联 <span className="font-bold text-foreground">{posts.length + essays.length}</span> 份记录。
                    用主题词快速进入案卷或样本。
                </p>
            </header>

            <section className="mb-10 border border-foreground/50 bg-card/80 p-5" style={{ animationDelay: "100ms" }}>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => {
                        const ratio = tag.total / maxCount;
                        const size = ratio > 0.8 ? "text-xl font-bold" : ratio > 0.6 ? "text-lg font-bold" : ratio > 0.4 ? "text-base font-semibold" : ratio > 0.2 ? "text-sm font-medium" : "text-xs font-medium";
                        const opacity = ratio > 0.6 ? "opacity-100" : ratio > 0.3 ? "opacity-80" : "opacity-60";
                        return (
                            <Link
                                key={tag.name}
                                href={`/search?q=${encodeURIComponent(tag.name)}`}
                                className={`group inline-flex items-center gap-1.5 border border-border bg-background px-3 py-2 text-foreground transition-colors hover:border-primary hover:text-primary ${size} ${opacity}`}
                                style={{ animationDelay: `${idx * 30}ms` }}
                            >
                                <Hash className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                {tag.name}
                                <span className="ml-1 border border-border bg-card px-1.5 py-0.5 font-mono text-xs font-normal text-muted-foreground">
                                    {tag.total}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <div className="archive-section-heading mb-8">
                    <span>01</span>
                    <div>
                        <h2>标签登记</h2>
                        <p>每个标签都可以跳转到对应主题的案卷或样本。</p>
                    </div>
                </div>
                <div className="border-y border-foreground/70">
                    {tags.map((tag, idx) => (
                        <Link
                            key={tag.name}
                            href={`/blog?tag=${encodeURIComponent(tag.name)}`}
                            className="group grid gap-3 border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-secondary/70 sm:grid-cols-[4rem_1fr_11rem]"
                            style={{ animationDelay: `${200 + idx * 20}ms` }}
                        >
                            <span className="font-mono text-lg font-black text-primary">{String(idx + 1).padStart(3, "0")}</span>
                            <span className="flex min-w-0 items-center gap-2">
                                <Hash className="h-4 w-4 text-primary opacity-70 group-hover:opacity-100" />
                                <span className="truncate text-lg font-black transition-colors group-hover:text-primary">{tag.name}</span>
                            </span>
                            <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                                {tag.posts > 0 && (
                                    <span className="border border-border bg-card px-2 py-1">
                                        案卷 {tag.posts}
                                    </span>
                                )}
                                {tag.essays > 0 && (
                                    <span className="border border-border bg-card px-2 py-1">
                                        样本 {tag.essays}
                                    </span>
                                )}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
