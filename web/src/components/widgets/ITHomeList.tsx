"use client";

import { Clock, AlertCircle } from "lucide-react";
import { useApi } from "@/lib/hooks/useApi";
import type { ITHomeNews } from "@/lib/api/types";

function parsePubDate(pubDate: string): string {
  if (!pubDate) return "";
  const date = new Date(pubDate);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "刚刚";
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前`;
  const months = Math.floor(days / 30);
  return `${months} 个月前`;
}

export default function ITHomeList() {
  const { data, loading, error, retry } = useApi<ITHomeNews[]>(
    () => fetch("/api/ithome").then((r) => r.json()),
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
        <span>IT之家资讯加载失败</span>
        <button onClick={retry} className="ml-auto text-xs text-primary hover:underline">
          重试
        </button>
      </div>
    );
  }

  if (!data || !Array.isArray(data)) return null;

  return (
    <div className="brand-panel divide-y divide-border px-5">
      {data.slice(0, 6).map((item, i) => (
        <a
          key={i}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group grid gap-1.5 py-4"
        >
          <h4 className="line-clamp-2 text-sm font-semibold transition-colors group-hover:text-primary">
            {item.title}
          </h4>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {parsePubDate(item.pubDate)}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
