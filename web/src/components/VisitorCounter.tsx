"use client";

import { useState, useEffect } from "react";
import { Eye, Calendar } from "lucide-react";

export default function VisitorCounter() {
  const [count, setCount] = useState(0);
  const [days, setDays] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const firstVisit = localStorage.getItem("visitor:firstVisit");
    const prevCount = parseInt(localStorage.getItem("visitor:count") || "0", 10);

    if (!firstVisit) {
      localStorage.setItem("visitor:firstVisit", String(Date.now()));
    }

    const newCount = prevCount + 1;
    localStorage.setItem("visitor:count", String(newCount));
    setCount(newCount);

    const first = parseInt(firstVisit || String(Date.now()), 10);
    setDays(Math.floor((Date.now() - first) / 86400000) + 1);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-6 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <Eye className="h-3.5 w-3.5" />
        {count} 次访问
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5" />
        已陪伴 {days} 天
      </span>
    </div>
  );
}
