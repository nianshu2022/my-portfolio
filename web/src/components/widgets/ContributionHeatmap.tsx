"use client";

import { CalendarDays, AlertCircle } from "lucide-react";
import { fetchApi } from "@/lib/api/fetch-wrapper";
import { useApi } from "@/lib/hooks/useApi";
import type { GitHubEvent, ContributionDay } from "@/lib/api/types";

const LEVEL_COLORS = [
  "bg-muted",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/60",
  "bg-primary",
];

const DAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"];

function buildContributionGrid(events: GitHubEvent[]): ContributionDay[] {
  const countByDate = new Map<string, number>();

  for (const event of events) {
    if (event.type !== "PushEvent") continue;
    const date = event.created_at.slice(0, 10);
    countByDate.set(date, (countByDate.get(date) || 0) + 1);
  }

  const days: ContributionDay[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const count = countByDate.get(dateStr) || 0;
    let level: ContributionDay["level"] = 0;
    if (count >= 10) level = 4;
    else if (count >= 6) level = 3;
    else if (count >= 3) level = 2;
    else if (count >= 1) level = 1;
    days.push({ date: dateStr, count, level });
  }

  return days;
}

function getMonthLabels(days: ContributionDay[]): { label: string; index: number }[] {
  const labels: { label: string; index: number }[] = [];
  let lastMonth = -1;

  for (let i = 0; i < days.length; i++) {
    const month = new Date(days[i].date).getMonth();
    if (month !== lastMonth) {
      const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
      labels.push({ label: monthNames[month], index: i });
      lastMonth = month;
    }
  }

  return labels;
}

export default function ContributionHeatmap() {
  const { data, loading, error, retry } = useApi<ContributionDay[]>(
    () =>
      fetchApi<ContributionDay[]>(
        "https://api.github.com/users/nianshu2022/events/public?per_page=100",
        {
          cacheKey: "github-contributions",
          cacheTTL: 2 * 60 * 60 * 1000,
          transform: (raw) => buildContributionGrid(raw as GitHubEvent[]),
        },
      ),
    [],
  );

  if (loading) {
    return (
      <div className="garden-panel overflow-hidden p-5">
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 52 }).map((_, col) => (
            <div key={col} className="flex flex-col gap-0.5">
              {Array.from({ length: 7 }).map((_, row) => (
                <div key={row} className="h-2.5 w-2.5 animate-pulse rounded-sm bg-muted" />
              ))}
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
        <span>贡献数据加载失败</span>
        <button onClick={retry} className="ml-auto text-xs text-primary hover:underline">
          重试
        </button>
      </div>
    );
  }

  if (!data) return null;

  const monthLabels = getMonthLabels(data);

  // Arrange into weeks (columns). Each week starts on Sunday.
  const firstDayOfWeek = new Date(data[0].date).getDay();
  const weeks: (ContributionDay | null)[][] = [];
  let currentWeek: (ContributionDay | null)[] = new Array(firstDayOfWeek).fill(null);

  for (const day of data) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  return (
    <div className="garden-panel overflow-hidden p-5">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">GitHub 贡献记录</h3>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Month labels */}
          <div className="mb-1 flex gap-0.5 pl-6">
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="text-[10px] text-muted-foreground"
                style={{ marginLeft: i === 0 ? 0 : `${(m.index - (monthLabels[i - 1]?.index ?? 0)) * 10.5 - 16}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 pr-1">
              {DAY_LABELS.map((label, i) => (
                <span key={i} className="flex h-2.5 items-center text-[10px] text-muted-foreground">
                  {i % 2 === 1 ? label : ""}
                </span>
              ))}
            </div>

            {/* Contribution cells */}
            {weeks.map((week, col) => (
              <div key={col} className="flex flex-col gap-0.5">
                {week.map((day, row) => (
                  <div
                    key={row}
                    className={`h-2.5 w-2.5 rounded-sm ${day ? LEVEL_COLORS[day.level] : "bg-transparent"}`}
                    title={day ? `${day.date}: ${day.count} 次贡献` : undefined}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-2 flex items-center gap-1 pl-6">
            <span className="text-[10px] text-muted-foreground">少</span>
            {LEVEL_COLORS.map((color, i) => (
              <div key={i} className={`h-2.5 w-2.5 rounded-sm ${color}`} />
            ))}
            <span className="text-[10px] text-muted-foreground">多</span>
          </div>
        </div>
      </div>
    </div>
  );
}
