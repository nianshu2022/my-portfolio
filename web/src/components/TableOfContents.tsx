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

  const getActiveId = useCallback(() => {
    const headings = toc
      .map((item) => document.getElementById(item.slug))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return "";

    const OFFSET = 100;
    let activeSlug = headings[0].id;

    for (let i = 0; i < headings.length; i++) {
      const rect = headings[i].getBoundingClientRect();
      if (rect.top - OFFSET <= 0) {
        activeSlug = headings[i].id;
      } else {
        break;
      }
    }

    return activeSlug;
  }, [toc]);

  useEffect(() => {
    const onScroll = () => setActiveId(getActiveId());
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [getActiveId]);

  // Auto-scroll TOC to keep active item visible
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

  if (toc.length === 0) return null;

  // Count h2 sections for numbering
  let h2Counter = 0;

  return (
    <nav aria-label="文章目录">
      <ul ref={tocRef} className="space-y-0.5">
        {toc.map((item) => {
          const isActive = activeId === item.slug;
          const isH2 = item.level === 2;
          const isH3 = item.level === 3;
          if (isH2) h2Counter++;

          return (
            <li
              key={item.slug}
              ref={isActive ? (el) => { activeItemRef.current = el; } : undefined}
            >
              <a
                href={`#${item.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.slug)?.scrollIntoView({ behavior: "smooth" });
                  setActiveId(item.slug);
                }}
                className={cn(
                  "group relative flex items-start gap-2.5 rounded-lg py-1.5 pr-2 text-[13px] leading-snug transition-all duration-200",
                  isH3 ? "ml-4 pl-2" : "pl-2",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Active indicator bar */}
                <span
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-full transition-all duration-300",
                    isActive
                      ? "h-4 bg-primary opacity-100"
                      : "h-2 bg-border opacity-0 group-hover:opacity-60"
                  )}
                />

                {/* Number or dot */}
                {isH2 ? (
                  <span
                    className={cn(
                      "mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                    )}
                  >
                    {h2Counter}
                  </span>
                ) : (
                  <span
                    className={cn(
                      "mt-[7px] h-1 w-1 flex-shrink-0 rounded-full transition-colors",
                      isActive ? "bg-primary" : "bg-border group-hover:bg-primary/50"
                    )}
                  />
                )}

                <span className="flex-1 leading-relaxed">{item.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
