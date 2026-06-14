"use client";

import { useState, useEffect } from "react";
import { Eye, Calendar } from "lucide-react";

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [days, setDays] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const firstVisit = localStorage.getItem("visitor:firstVisit");

    if (!firstVisit) {
      localStorage.setItem("visitor:firstVisit", String(Date.now()));
    }

    const first = parseInt(firstVisit || String(Date.now()), 10);
    setDays(Math.floor((Date.now() - first) / 86400000) + 1);
    setMounted(true);

    const loadStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${apiUrl}/api/stats`, { cache: "no-store" });
        const data = res.ok ? await res.json() : null;
        let totalViews = Number(data?.total_views);

        if (!Number.isFinite(totalViews)) {
          const gardenRes = await fetch(`${apiUrl}/api/garden`, { cache: "no-store" });
          if (!gardenRes.ok) return;

          const posts = await gardenRes.json();
          totalViews = Array.isArray(posts)
            ? posts.reduce((sum, post) => sum + Number(post.views || 0), 0)
            : NaN;
        }

        if (Number.isFinite(totalViews)) {
          setCount(totalViews);
        }
      } catch {}
    };

    loadStats();
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-6 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <Eye className="h-3.5 w-3.5" />
        {count === null ? "访问统计同步中" : `${count.toLocaleString()} 次访问`}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5" />
        已陪伴 {days} 天
      </span>
    </div>
  );
}
