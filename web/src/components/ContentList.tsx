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

function buildArchiveNumbers(posts: PostSummary[]) {
  const byYear = new Map<string, PostSummary[]>();

  posts.forEach((post) => {
    const year = post.date.slice(0, 4) || "0000";
    byYear.set(year, [...(byYear.get(year) || []), post]);
  });

  const numbers = new Map<string, { short: string; full: string }>();
  byYear.forEach((yearPosts, year) => {
    yearPosts
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.slug.localeCompare(b.slug);
      })
      .forEach((post, index) => {
        const short = String(index + 1).padStart(3, "0");
        numbers.set(post.slug, {
          short,
          full: `NS-${year}-${short}`,
        });
      });
  });

  return numbers;
}

export default function ContentList({ posts, type }: ContentListProps) {
  const searchParams = useSearchParams();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const { activeIndex } = useKeyboardNav("[data-article-link]");

  const isPost = type === "post";
  const basePath = isPost ? "/blog" : "/essays";
  const label = isPost ? "技术案卷库" : "成长样本库";
  const subtitle = isPost
    ? "把部署、排障、升级和工具链实践整理成可复用的案卷。"
    : "把阶段经历、比赛、毕业和生活切片留下来，记录一个 00 后正在形成自己的系统。";
  const stamp = isPost ? "案卷" : "样本";
  const archiveNumbers = useMemo(() => buildArchiveNumbers(posts), [posts]);

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
      <header className="border-b border-foreground/80 pb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 inline-flex border border-primary px-2 py-1 font-mono text-sm font-bold text-primary">
              {isPost ? "TECH DOSSIERS" : "GROWTH SAMPLES"}
            </div>
            <h1 className="text-[clamp(2.8rem,8vw,5.6rem)] font-black leading-none tracking-normal text-foreground">
              {label}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
          </div>
          <div className="font-mono text-sm text-muted-foreground">
            共 <strong className="text-foreground">{posts.length}</strong> 份{stamp}
          </div>
        </div>
      </header>

      <div className="grid gap-5 border-b border-border py-6">
        {allTags.length > 1 && (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="标签筛选">
            <Tag className="h-4 w-4 text-primary" />
            <button
              onClick={() => setActiveTag(null)}
              aria-pressed={activeTag === null}
              className={`border px-3 py-1.5 text-sm font-semibold transition-colors ${
                activeTag === null
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              全部
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                aria-pressed={activeTag === tag}
                className={`border px-3 py-1.5 text-sm transition-colors ${
                  activeTag === tag
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        <label className="group flex items-center gap-3 border border-border bg-card px-3 py-3">
          <Search className="h-4 w-4 text-primary" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isPost ? "检索标题、问题或技术栈" : "检索标题、经历或标签"}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
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
      </div>

      <div className="mt-8 border-y border-foreground/70">
        {filtered.length === 0 && (
          <div className="px-5 py-14 text-center text-sm text-muted-foreground">
            没有匹配到{stamp}，试试更短的关键词或清空筛选条件。
          </div>
        )}

        {filtered.map((post, index) => (
          <ScrollReveal key={`${post.slug}-${index}`} delay={Math.min(index * 0.04, 0.24)}>
            <Link
              href={`${basePath}/${post.slug}`}
              data-article-link
              className={`group grid gap-4 border-b border-border px-4 py-5 transition-colors last:border-b-0 hover:bg-secondary/70 lg:grid-cols-[4.5rem_4rem_1fr_7rem_8rem] lg:items-center ${
                activeIndex === index ? "bg-accent" : ""
              }`}
            >
              <span className="font-mono text-xl font-black text-primary">
                {archiveNumbers.get(post.slug)?.short || "000"}
              </span>
              <span className="w-fit border border-primary px-1.5 py-1 text-xs font-semibold text-primary lg:[writing-mode:vertical-rl]">
                {stamp}
              </span>
              <span className="grid min-w-0 gap-2">
                <strong className="text-xl font-black leading-snug tracking-normal transition-colors group-hover:text-primary">
                  {post.title}
                </strong>
                <span className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {post.description}
                </span>
                <span className="flex flex-wrap gap-2">
                  {(post.tags?.length ? post.tags : [FALLBACK_TAG]).slice(0, 4).map((tag) => (
                    <em key={tag} className="border border-border bg-card px-2 py-1 font-mono text-xs not-italic text-muted-foreground">
                      #{tag}
                    </em>
                  ))}
                </span>
              </span>
              <span className="font-mono text-sm text-muted-foreground">{post.date}</span>
              <span className="inline-flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground lg:grid">
                <span>{archiveNumbers.get(post.slug)?.full || "NS-0000-000"}</span>
                <span className="inline-flex items-center gap-1 text-primary">
                  阅读
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </span>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
