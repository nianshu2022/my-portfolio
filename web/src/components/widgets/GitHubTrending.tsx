"use client";

import { Star, AlertCircle } from "lucide-react";
import { useApi } from "@/lib/hooks/useApi";
import type { TrendingRepo } from "@/lib/api/types";

export default function GitHubTrending() {
  const { data, loading, error, retry } = useApi<TrendingRepo[]>(
    () => fetch("/api/github-trending").then((r) => r.json()),
    [],
  );

  if (loading) {
    return (
      <div className="garden-panel p-5">
        <div className="mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          <div className="h-5 w-28 animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-5 w-12 animate-pulse rounded bg-muted" />
              <div className="h-5 flex-1 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="garden-panel flex items-center gap-2 p-5 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <span>GitHub Trending 加载失败</span>
        <button onClick={retry} className="ml-auto text-xs text-primary hover:underline">
          重试
        </button>
      </div>
    );
  }

  if (!data || !Array.isArray(data)) return null;

  return (
    <div className="garden-panel p-5">
      <div className="mb-4 flex items-center gap-2">
        <Star className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">GitHub 热门项目</h3>
        <span className="ml-auto text-xs text-muted-foreground">今日</span>
      </div>
      <div className="space-y-3">
        {data.slice(0, 6).map((repo, i) => (
          <a
            key={i}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3"
          >
            <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-primary">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium transition-colors group-hover:text-primary">
                {repo.name}
              </p>
              {repo.description && (
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {repo.description}
                </p>
              )}
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                {repo.language && (
                  <span className="rounded bg-secondary px-1.5 py-0.5">{repo.language}</span>
                )}
                {repo.stars && (
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {repo.stars}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
