"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search, Tag, X } from "lucide-react";
import type { PostSummary } from "@/lib/posts";
import { useSearchParams } from "next/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import { useKeyboardNav } from "@/lib/hooks/useKeyboardNav";

const FALLBACK_TAG = "未分类";

type ContentListProps = {
  posts: PostSummary[];
  type: "post" | "essay";
};

export default function ContentList({ posts, type }: ContentListProps) {
  const searchParams = useSearchParams();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const { activeIndex } = useKeyboardNav("[data-article-link]");

  const isPost = type === "post";
  const basePath = isPost ? "/blog" : "/essays";
  const label = isPost ? "博客文章" : "个人随笔";
  const subtitle = isPost
    ? "记录技术折腾的真实过程——踩坑、调试、部署和思考。"
    : "记录成长的切片——经历、比赛、阶段复盘和生活感悟。";

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
    ? posts.filter((post) =>
        activeTag === FALLBACK_TAG
          ? !post.tags?.length
          : post.tags?.includes(activeTag)
      )
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
      {/* ── Page Header ── */}
      <header className="mb-8 border-b border-border pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold text-primary">
              {isPost ? "✦ 技术 · 成长 · 记录" : "✦ 随想 · 生活 · 感悟"}
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">
              <span className="gradient-text">{label}</span>
            </h1>
            <p className="mt-3 max-w-xl text-base leading-8 text-muted-foreground">
              {subtitle}
            </p>
          </div>
          <div className="flex-shrink-0 rounded-2xl border border-border bg-card px-5 py-3 text-center">
            <p className="text-3xl font-black text-foreground">{posts.length}</p>
            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
              {isPost ? "篇文章" : "篇随笔"}
            </p>
          </div>
        </div>
      </header>

      {/* ── Filters ── */}
      <div className="mb-6 space-y-4">
        {allTags.length > 1 && (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="标签筛选">
            <Tag className="h-4 w-4 text-primary" />
            <button
              onClick={() => setActiveTag(null)}
              aria-pressed={activeTag === null}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${
                activeTag === null
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              全部
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                aria-pressed={activeTag === tag}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-all ${
                  activeTag === tag
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        <label className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors focus-within:border-primary/50">
          <Search className="h-4 w-4 flex-shrink-0 text-primary" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isPost ? "搜索标题、技术栈…" : "搜索标题、经历…"}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="清空搜索"
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </label>
      </div>

      {/* ── Post List ── */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-border bg-card px-5 py-14 text-center text-sm text-muted-foreground">
            没有匹配结果，试试更短的关键词或清空筛选条件。
          </div>
        )}

        {filtered.map((post, index) => (
          <ScrollReveal key={`${post.slug}-${index}`} delay={Math.min(index * 0.04, 0.2)}>
            <Link
              href={`${basePath}/${post.slug}`}
              data-article-link
              className={`group flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md ${
                activeIndex === index ? "border-primary/40 bg-secondary" : ""
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                {(post.tags?.length ? post.tags : [FALLBACK_TAG]).slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
                <time className="ml-auto text-xs font-medium text-muted-foreground">
                  {post.date}
                </time>
              </div>

              <h2 className="text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                {post.title}
              </h2>

              {post.description && (
                <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {post.description}
                </p>
              )}

              <div className="mt-1 flex items-center justify-end">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  阅读全文
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
