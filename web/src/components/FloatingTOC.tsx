"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { TOCItem } from "@/lib/posts";

interface FloatingTOCProps {
  toc: TOCItem[];
}

export default function FloatingTOC({ toc }: FloatingTOCProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [visible, setVisible] = useState(false);
  // 动态计算的 left 偏移（紧贴文章右侧）
  const [leftOffset, setLeftOffset] = useState<number | null>(null);
  const tocRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  // 测量文章内容区域的右边缘，将 TOC 紧贴其右侧
  const updatePosition = useCallback(() => {
    // 查找文章主体区域：blog-content 所在的 article
    const article = document.querySelector("article");
    if (!article) return;
    const rect = article.getBoundingClientRect();
    const gap = 24; // 文章右边缘 → TOC 左边缘的间距
    setLeftOffset(rect.right + gap);
  }, []);

  // 根据滚动位置计算当前激活的 heading
  const computeActiveId = useCallback(() => {
    if (toc.length === 0) return "";
    const OFFSET = 100;
    let result = toc[0].slug;

    for (const item of toc) {
      const el = document.getElementById(item.slug);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top - OFFSET <= 0) {
        result = item.slug;
      } else {
        break;
      }
    }
    return result;
  }, [toc]);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
      setActiveId(computeActiveId());
    };

    onScroll();
    updatePosition();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updatePosition);
    };
  }, [computeActiveId, updatePosition]);

  // 用 ResizeObserver 监听文章宽度变化（字号切换等情况）
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;
    const ro = new ResizeObserver(() => updatePosition());
    ro.observe(article);
    return () => ro.disconnect();
  }, [updatePosition]);

  // active 项超出 TOC 视窗时自动滚入
  useEffect(() => {
    if (!activeId || !tocRef.current) return;
    const item = itemRefs.current.get(activeId);
    if (!item) return;
    const container = tocRef.current.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    if (itemRect.top < containerRect.top + 8 || itemRect.bottom > containerRect.bottom - 8) {
      item.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeId]);

  if (!toc || toc.length === 0) return null;

  // 还没测量到位置时不渲染，避免闪烁到 right-6 位置
  if (leftOffset === null) return null;

  // 如果 TOC 距屏幕右边缘空间不足 220px，直接不显示
  const tocWidth = 224; // w-56 = 224px
  if (leftOffset + tocWidth > window.innerWidth - 8) return null;

  return (
    <div
      className={cn(
        "fixed top-1/2 -translate-y-1/2 z-40",
        // 只在有足够空间时显示（xl 断点以上）
        "hidden xl:flex flex-col",
        "max-h-[70vh]",
        "transition-all duration-300",
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
      )}
      style={{
        left: leftOffset,
        width: tocWidth,
      }}
      aria-label="文章目录"
    >
      {/* 目录卡片 */}
      <div className="rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-700/60 shadow-lg overflow-hidden flex flex-col">
        {/* 标题栏 */}
        <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest select-none">
            目录
          </span>
        </div>

        {/* 可滚动目录内容 */}
        <div className="overflow-y-auto custom-scrollbar p-3">
          <ul ref={tocRef} className="space-y-0.5 text-sm">
            {toc.map((item) => {
              const isActive = activeId === item.slug;
              return (
                <li
                  key={item.slug}
                  ref={(el) => {
                    if (el) itemRefs.current.set(item.slug, el);
                    else itemRefs.current.delete(item.slug);
                  }}
                  className={cn(
                    "transition-all duration-200 border-l-2 pl-3 py-1 rounded-r",
                    isActive
                      ? "border-blue-500 text-blue-600 dark:text-blue-400 font-medium bg-blue-50/70 dark:bg-blue-900/20"
                      : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600",
                    item.level === 3 && "ml-3 text-xs"
                  )}
                >
                  <a
                    href={`#${item.slug}`}
                    className="block leading-snug"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(item.slug);
                      if (el) {
                        const offset = 80;
                        const top = el.getBoundingClientRect().top + window.scrollY - offset;
                        window.scrollTo({ top, behavior: "smooth" });
                      }
                      setActiveId(item.slug);
                    }}
                  >
                    {item.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
