"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Search, Tag, X } from "lucide-react";
import type { PostSummary } from "@/lib/posts";
import { useSearchParams } from "next/navigation";
import ScrollReveal from "@/components/ScrollReveal";

type BlogListProps = {
  posts: PostSummary[];
};

const FALLBACK_TAG = "未分类";

export default function BlogList({ posts }: BlogListProps) {
  const searchParams = useSearchParams();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => {
      if (post.tags?.length) post.tags.forEach((tag) => tags.add(tag));
      else tags.add(FALLBACK_TAG);
    });
    return Array.from(tags).sort();
  }, [posts]);

  useEffect(() => {
    const tagParam = searchParams.get("tag");
    const initialTag = tagParam ? decodeURIComponent(tagParam).trim() : null;
    if (!initialTag) {
      setActiveTag(null);
      return;
    }
    setActiveTag(allTags.includes(initialTag) ? initialTag : null);
  }, [searchParams, allTags]);

  const filteredByTag = activeTag
    ? posts.filter((post) => (activeTag === FALLBACK_TAG ? !post.tags?.length : post.tags?.includes(activeTag)))
    : posts;

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? filteredByTag.filter(
        (post) =>
          post.title.toLowerCase().includes(normalizedQuery) ||
          post.description.toLowerCase().includes(normalizedQuery) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      )
    : filteredByTag;

  return (
    <section className="w-full">
      <header className="mb-8 border-b border-border pb-8">
        <p className="garden-kicker">技术笔记</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="garden-title inline-flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              技术博客
            </h1>
            <p className="garden-subtitle mt-3">聚焦可复用的部署经验、运维排障与 AI 工具实战。</p>
          </div>
          <span className="text-sm text-muted-foreground">{posts.length} 篇</span>
        </div>
      </header>

      {allTags.length > 1 && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <button onClick={() => setActiveTag(null)} className={`rounded-md border px-3 py-1.5 text-sm ${activeTag === null ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:bg-secondary"}`}>
            全部
          </button>
          {allTags.map((tag) => (
            <button key={tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)} className={`rounded-md border px-3 py-1.5 text-sm ${activeTag === tag ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:bg-secondary"}`}>
              #{tag}
            </button>
          ))}
        </div>
      )}

      <div className="mb-8">
        <label className="group flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索标题、摘要或标签"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="清空搜索"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </label>
      </div>

      <div className="grid gap-3">
        {filtered.length === 0 && (
          <div className="garden-panel px-5 py-10 text-center text-sm text-muted-foreground">
            没有匹配到内容，试试更短的关键词或清空筛选条件。
          </div>
        )}
        {filtered.map((post, i) => (
          <ScrollReveal key={`${post.slug}-${i}`} delay={i * 0.06}>
            <Link href={`/blog/${post.slug}`} className="garden-panel group grid gap-3 p-5 transition-all hover:border-primary/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <h2 className="text-xl font-semibold tracking-normal transition-colors group-hover:text-primary">{post.title}</h2>
                <span className="text-sm text-muted-foreground">{post.date}</span>
              </div>
              <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{post.description}</p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {(post.tags?.length ? post.tags : [FALLBACK_TAG]).slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-md bg-background px-2 py-1 text-xs text-muted-foreground">#{tag}</span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  阅读 <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
