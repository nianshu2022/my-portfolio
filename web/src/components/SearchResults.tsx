"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import { BookOpen, Feather, Search, X } from "lucide-react";
import type { PostSummary } from "@/lib/posts";
import ScrollReveal from "@/components/ScrollReveal";

type SearchResultsProps = {
  posts: PostSummary[];
  essays: PostSummary[];
};

type SearchItem = {
  type: "post" | "essay";
  item: PostSummary;
};

export default function SearchResults({ posts, essays }: SearchResultsProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get("q");
    if (qParam) setQuery(decodeURIComponent(qParam));
    setInitialized(true);
  }, []);

  const updateUrl = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      const url = trimmed
        ? `/search?q=${encodeURIComponent(trimmed)}`
        : "/search";
      router.replace(url, { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    if (!initialized) return;
    const timer = setTimeout(() => updateUrl(query), 300);
    return () => clearTimeout(timer);
  }, [query, initialized, updateUrl]);

  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    const allItems: SearchItem[] = [
      ...posts.map((item) => ({ type: "post" as const, item })),
      ...essays.map((item) => ({ type: "essay" as const, item })),
    ];

    if (!normalizedQuery) {
      return allItems
        .sort((a, b) => new Date(b.item.date).getTime() - new Date(a.item.date).getTime())
        .slice(0, 20);
    }

    return allItems
      .filter(({ item }) => {
        return (
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.description.toLowerCase().includes(normalizedQuery) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery))
        );
      })
      .sort((a, b) => new Date(b.item.date).getTime() - new Date(a.item.date).getTime());
  }, [posts, essays, normalizedQuery]);

  function highlightMatch(text: string, q: string) {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-primary/20 text-foreground rounded-sm px-0.5">{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </>
    );
  }

  return (
    <section className="w-full">
      <div className="mb-8">
        <label className="group flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索标题、摘要或标签"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="清空搜索"
              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </label>
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        {normalizedQuery ? `找到 ${results.length} 条结果` : "输入关键词开始搜索，或浏览最近更新"}
      </div>

      <div className="grid gap-3">
        {results.length === 0 && (
          <div className="garden-panel px-5 py-10 text-center text-sm text-muted-foreground">
            没有匹配到内容，试试更短的关键词。
          </div>
        )}
        {results.map(({ type, item }, i) => (
          <ScrollReveal key={`${type}-${item.slug}`} delay={Math.min(i * 0.05, 0.25)}>
            <Link
              href={type === "post" ? `/blog/${item.slug}` : `/essays/${item.slug}`}
              className="garden-panel group grid gap-2 p-5 transition-all hover:border-primary/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {type === "post" ? <BookOpen className="h-3.5 w-3.5" /> : <Feather className="h-3.5 w-3.5" />}
                <span>{type === "post" ? "技术博客" : "生活随笔"}</span>
                <span>{item.date}</span>
              </div>
              <h2 className="text-lg font-semibold transition-colors group-hover:text-primary">
                {highlightMatch(item.title, normalizedQuery)}
              </h2>
              <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                {highlightMatch(item.description, normalizedQuery)}
              </p>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
