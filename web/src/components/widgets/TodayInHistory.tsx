"use client";

import { Landmark, AlertCircle } from "lucide-react";
import { fetchApi } from "@/lib/api/fetch-wrapper";
import { useApi } from "@/lib/hooks/useApi";
import type { HistoryEvent } from "@/lib/api/types";

interface HistoryApiResponse {
  code: number;
  data: { year: string; description: string }[];
}

export default function TodayInHistory() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const { data, loading, error, retry } = useApi<HistoryEvent[]>(
    () =>
      fetchApi<HistoryEvent[]>(
        `https://api.03c3.cn/api/history`,
        {
          cacheKey: "today-in-history-v2",
          cacheTTL: 24 * 60 * 60 * 1000,
          transform: (raw) =>
            (raw as HistoryApiResponse).data.slice(0, 6).map((item) => ({
              year: item.year,
              title: item.description,
            })),
        },
      ),
    [],
  );

  if (loading) {
    return (
      <div className="garden-panel p-5">
        <div className="mb-4 flex items-center gap-2">
          <Landmark className="h-5 w-5 text-primary" />
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
        <span>历史今天加载失败</span>
        <button onClick={retry} className="ml-auto text-xs text-primary hover:underline">
          重试
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="garden-panel p-5">
      <div className="mb-4 flex items-center gap-2">
        <Landmark className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">历史上的今天</h3>
        <span className="ml-auto text-xs text-muted-foreground">{month}月{day}日</span>
      </div>
      <div className="space-y-3">
        {data.map((event, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-primary">
              {event.year}
            </span>
            <span className="text-sm leading-5 text-muted-foreground">{event.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
