"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { TOCItem } from "@/lib/posts";

interface TableOfContentsProps {
  toc: TOCItem[];
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const tocRef = useRef<HTMLUListElement>(null);
  const activeItemRef = useRef<HTMLLIElement | null>(null);

  // 用 scroll 事件 + getBoundingClientRect 确保任何时刻都有高亮
  const getActiveId = useCallback(() => {
    const headings = toc
      .map((item) => document.getElementById(item.slug))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return "";

    // 找到第一个"还没出屏幕顶部"的标题（距顶部最近但 ≥ 0 的）
    // 如果全部在屏幕上方，取最后一个（说明用户已滚过所有标题）
    const OFFSET = 96; // header 高度 + buffer
    let activeSlug = headings[0].id;

    for (let i = 0; i < headings.length; i++) {
      const rect = headings[i].getBoundingClientRect();
      if (rect.top - OFFSET <= 0) {
        // 这个标题已经滚过了顶部，标记为"当前或之前"
        activeSlug = headings[i].id;
      } else {
        // 这个标题还在屏幕下方，停止
        break;
      }
    }

    return activeSlug;
  }, [toc]);

  useEffect(() => {
    const onScroll = () => {
      const id = getActiveId();
      setActiveId(id);
    };

    // 初始化
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [getActiveId]);

  // 当 activeId 变化时，自动将目录滚动到可见区域
  useEffect(() => {
    if (!activeItemRef.current || !tocRef.current) return;
    const container = tocRef.current.parentElement;
    if (!container) return;

    const item = activeItemRef.current;
    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    if (itemRect.top < containerRect.top || itemRect.bottom > containerRect.bottom) {
      item.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeId]);

  return (
    <nav aria-label="文章目录">
      <ul ref={tocRef} className="space-y-0.5">
        {toc.map((item) => {
          const isActive = activeId === item.slug;
          return (
            <li key={item.slug}>
              <a
                href={`#${item.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.slug)?.scrollIntoView({
                    behavior: "smooth",
                  });
                  setActiveId(item.slug);
                }}
                className={cn(
                  "flex items-center gap-2 border-l-2 border-transparent px-3 py-1.5 text-[13px] leading-snug transition-all duration-200",
                  item.level === 3 && "ml-3",
                  isActive
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:border-border hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-1.5 w-1.5 shrink-0 transition-colors duration-200",
                    isActive ? "bg-primary" : "bg-border"
                  )}
                />
                <span className="truncate">{item.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
