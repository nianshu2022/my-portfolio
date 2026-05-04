"use client";

import { Quote, AlertCircle } from "lucide-react";
import { fetchApi } from "@/lib/api/fetch-wrapper";
import { useApi } from "@/lib/hooks/useApi";
import type { HitokotoData } from "@/lib/api/types";

const TYPE_MAP: Record<string, string> = {
  a: "动画",
  b: "漫画",
  c: "游戏",
  d: "文学",
  e: "原创",
  f: "来自网络",
  g: "其他",
  h: "影视",
  i: "诗词",
  j: "网易云",
  k: "哲学",
  l: "抖机灵",
};

export default function DailyQuote() {
  const { data, loading, error } = useApi<HitokotoData>(
    () => fetchApi<HitokotoData>("https://v1.hitokoto.cn/"),
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
        <span>一言加载失败</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex items-start gap-3 py-2">
      <Quote className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-sm italic leading-7 text-muted-foreground">
          &ldquo;{data.hitokoto}&rdquo;
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          {data.from_who && <span>—— {data.from_who}</span>}
          {data.from && <span>「{data.from}」</span>}
          <span className="ml-2 rounded bg-secondary px-1.5 py-0.5 text-[10px]">
            {TYPE_MAP[data.type] ?? data.type}
          </span>
        </p>
      </div>
    </div>
  );
}
