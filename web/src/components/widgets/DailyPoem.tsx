"use client";

import { ScrollText, AlertCircle } from "lucide-react";
import { fetchApi } from "@/lib/api/fetch-wrapper";
import { useApi } from "@/lib/hooks/useApi";
import type { PoemData } from "@/lib/api/types";

interface JinrishiciResponse {
  data: {
    content: string;
    origin: {
      title: string;
      dynasty: string;
      author: string;
    };
  };
}

export default function DailyPoem() {
  const { data, loading, error } = useApi<PoemData>(
    () =>
      fetchApi<PoemData>("https://v2.jinrishici.com/one.json", {
        cacheKey: "daily-poem",
        cacheTTL: 12 * 60 * 60 * 1000,
        transform: (raw) => {
          const res = raw as JinrishiciResponse;
          return {
            content: res.data.content,
            title: res.data.origin.title,
            author: res.data.origin.author,
            dynasty: res.data.origin.dynasty,
          };
        },
      }),
    [],
  );

  if (loading) {
    return (
      <div className="flex items-start gap-3 py-2">
        <div className="h-4 w-4 animate-pulse rounded bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <span>诗词加载失败</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex items-start gap-3 py-2">
      <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-sm italic leading-7 text-muted-foreground">
          &ldquo;{data.content}&rdquo;
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          <span>—— {data.dynasty} · {data.author}</span>
          <span className="ml-2 rounded bg-secondary px-1.5 py-0.5 text-[10px]">
            「{data.title}」
          </span>
        </p>
      </div>
    </div>
  );
}
