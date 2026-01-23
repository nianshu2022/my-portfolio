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

  if (!toc || toc.length === 0) return null;

  return (
    <ul className="space-y-2 text-sm pl-2">
      {toc.map((item) => (
        <li
          key={item.slug}
          className={cn(
            "transition-colors duration-200 border-l-2 pl-3 py-1",
            activeId === item.slug
              ? "border-blue-500 text-blue-600 dark:text-blue-400 font-medium bg-blue-50/50 dark:bg-blue-900/10"
              : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700",
            item.level === 3 && "ml-4"
          )}
        >
          <a
            href={`#${item.slug}`}
            className="block"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.slug)?.scrollIntoView({
                behavior: "smooth",
              });
              setActiveId(item.slug);
            }}
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
}
