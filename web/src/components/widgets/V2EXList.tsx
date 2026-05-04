"use client";

import { MessageSquare, Clock, AlertCircle } from "lucide-react";
import { fetchApi, timeAgo } from "@/lib/api/fetch-wrapper";
import { useApi } from "@/lib/hooks/useApi";
import type { V2exTopic } from "@/lib/api/types";

export default function V2EXList() {
  const { data, loading, error, retry } = useApi<V2exTopic[]>(
    () =>
      fetchApi<V2exTopic[]>("https://api.codetabs.com/v1/proxy/?quest=https://www.v2ex.com/api/topics/hot.json", {
        cacheKey: "v2ex-hot",
        cacheTTL: 10 * 60 * 1000,
      }),
    [],
  );

  if (loading) {
    return (
      <div className="brand-panel divide-y divide-border px-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid gap-2 py-4">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="brand-panel flex items-center gap-2 p-5 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <span>V2EX 热门加载失败</span>
        <button onClick={retry} className="ml-auto text-xs text-primary hover:underline">
          重试
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="brand-panel divide-y divide-border px-5">
      {data.slice(0, 6).map((topic) => (
        <a
          key={topic.id}
          href={topic.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group grid gap-1.5 py-4"
        >
          <h4 className="line-clamp-2 text-sm font-semibold transition-colors group-hover:text-primary">
            {topic.title}
          </h4>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {topic.node?.title && (
              <span className="rounded bg-secondary px-1.5 py-0.5">
                {topic.node.title}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {topic.replies}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo(topic.created)}
            </span>
            <span className="text-muted-foreground/70">{topic.member?.username}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
