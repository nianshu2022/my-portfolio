"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { TOCItem } from "@/lib/posts";

interface TableOfContentsProps {
  toc: TOCItem[];
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.slug);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (!toc || toc.length === 0) return null;

  return (
    <nav aria-label="文章目录">
      <ul className="space-y-0.5">
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
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] leading-snug transition-all duration-200",
                  item.level === 3 && "ml-3",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-200",
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
