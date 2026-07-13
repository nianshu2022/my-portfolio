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
      <div className="mb-8 border border-foreground/50 bg-card/80 p-4">
        <label className="group flex items-center gap-3 border border-border bg-background px-3 py-3">
          <Search className="h-4 w-4 text-primary" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="检索标题、摘要或标签"
            className="w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="清空搜索"
              className="inline-flex h-7 w-7 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </label>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted-foreground">
          <span>{normalizedQuery ? `关键词：${query.trim()}` : "状态：等待检索"}</span>
          <span>{normalizedQuery ? `命中 ${results.length} 条` : `最近记录 ${results.length} 条`}</span>
        </div>
      </div>

      <div className="border-y border-foreground/70">
        {results.length === 0 && (
          <div className="px-5 py-14 text-center text-sm text-muted-foreground">
            没有匹配到档案，试试更短的关键词，或检索技术栈名称。
          </div>
        )}
        {results.map(({ type, item }, i) => (
          <ScrollReveal key={`${type}-${item.slug}`} delay={Math.min(i * 0.05, 0.25)}>
            <Link
              href={type === "post" ? `/blog/${item.slug}` : `/essays/${item.slug}`}
              className="group grid gap-3 border-b border-border px-4 py-5 transition-colors last:border-b-0 hover:bg-secondary/70 sm:grid-cols-[4rem_5rem_1fr_7rem] sm:items-center"
            >
              <span className="font-mono text-lg font-black text-primary">
                {String(i + 1).padStart(3, "0")}
              </span>
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {type === "post" ? <BookOpen className="h-3.5 w-3.5" /> : <Feather className="h-3.5 w-3.5" />}
                {type === "post" ? "文章" : "随笔"}
              </span>
              <span className="min-w-0">
                <h2 className="line-clamp-2 text-lg font-black transition-colors group-hover:text-primary">
                  {highlightMatch(item.title, normalizedQuery)}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {highlightMatch(item.description, normalizedQuery)}
                </p>
                {item.tags?.length > 0 && (
                  <span className="mt-2 block truncate font-mono text-xs text-muted-foreground">
                    {item.tags.slice(0, 4).join(" · ")}
                  </span>
                )}
              </span>
              <span className="font-mono text-sm text-muted-foreground">{item.date}</span>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
