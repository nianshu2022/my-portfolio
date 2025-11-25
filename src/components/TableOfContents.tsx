"use client";

import { useEffect, useState } from "react";

type Heading = {
  level: number;
  text: string;
  slug: string;
};

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
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
      {
        rootMargin: "-10% 0px -80% 0px", // 调整触发区域：顶部留10%，底部留80%（让标题滚动到上方时才激活）
        threshold: 0.1, // 只要出现10%就算进入
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.slug);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.slug);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  if (headings.length === 0) {
    return <p className="text-zinc-400 text-xs pl-2">暂无目录</p>;
  }

  return (
    <nav className="space-y-0.5 text-sm relative max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
      {headings.map((heading, index) => (
        <a
          key={index}
          href={`#${heading.slug}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(heading.slug)?.scrollIntoView({
              behavior: "smooth",
            });
            setActiveId(heading.slug); // 点击时立即高亮
          }}
          className={`block py-2 transition-all duration-300 border-l-4 rounded-r-lg my-1
            ${heading.level === 3 ? "pl-5 text-xs" : "pl-4 text-sm"}
            ${
              activeId === heading.slug
                ? "text-blue-700 dark:text-blue-300 border-blue-600 bg-blue-100 dark:bg-blue-900/40 font-bold shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 border-transparent hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            }
          `}
        >
          <span className="truncate block">{heading.text}</span>
        </a>
      ))}
    </nav>
  );
}

