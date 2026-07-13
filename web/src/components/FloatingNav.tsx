"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface FloatingNavProps {
  backUrl?: string;
  /** Label shown in the button. Defaults to auto-detect from backUrl. */
  backLabel?: string;
}

const LABEL_MAP: Record<string, string> = {
  "/blog": "博客",
  "/essays": "随笔",
  "/archive": "归档",
  "/tags": "标签",
  "/search": "搜索",
  "/portal": "服务",
  "/about": "关于",
  "/friends": "朋友",
};

export default function FloatingNav({
  backUrl = "/blog",
  backLabel,
}: FloatingNavProps) {
  const router = useRouter();
  const label = backLabel ?? LABEL_MAP[backUrl] ?? "返回";

  return (
    <div className="fixed left-4 top-20 z-50 sm:left-6">
      <button
        onClick={() => router.push(backUrl)}
        title={`返回${label}`}
        className="group flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-xl transition-all duration-200 hover:border-primary/40 hover:bg-card hover:text-primary hover:shadow-md"
      >
        <ArrowLeft className="h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 group-hover:max-w-[5rem] group-hover:opacity-100">
          {label}
        </span>
      </button>
    </div>
  );
}
