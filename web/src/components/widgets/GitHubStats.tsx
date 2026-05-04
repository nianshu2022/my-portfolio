"use client";

import { AlertCircle } from "lucide-react";
import { fetchApi } from "@/lib/api/fetch-wrapper";
import { useApi } from "@/lib/hooks/useApi";
import type { GitHubUserData } from "@/lib/api/types";

export default function GitHubStats() {
  const { data, loading, error, retry } = useApi<GitHubUserData>(
    () =>
      fetchApi<GitHubUserData>("https://api.github.com/users/nianshu2022", {
        cacheKey: "github-stats",
        cacheTTL: 60 * 60 * 1000,
      }),
    [],
  );

  if (loading) {
    return (
      <div className="garden-panel p-5">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="h-6 w-12 animate-pulse rounded bg-muted" />
              <div className="h-3 w-10 animate-pulse rounded bg-muted" />
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
        <span>GitHub 数据加载失败</span>
        <button onClick={retry} className="ml-auto text-xs text-primary hover:underline">
          重试
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="garden-panel p-5">
      <a href={data.html_url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4">
        <img
          src={data.avatar_url}
          alt={data.login}
          className="h-14 w-14 rounded-full border border-border"
        />
        <div>
          <p className="font-semibold group-hover:text-primary">{data.login}</p>
          {data.bio && (
            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{data.bio}</p>
          )}
        </div>
      </a>
      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-5 text-center">
        <div>
          <div className="text-xl font-semibold">{data.public_repos}</div>
          <div className="mt-1 text-xs text-muted-foreground">公开仓库</div>
        </div>
        <div>
          <div className="text-xl font-semibold">{data.followers}</div>
          <div className="mt-1 text-xs text-muted-foreground">关注者</div>
        </div>
        <div>
          <div className="text-xl font-semibold">{data.following}</div>
          <div className="mt-1 text-xs text-muted-foreground">正在关注</div>
        </div>
      </div>
    </div>
  );
}
