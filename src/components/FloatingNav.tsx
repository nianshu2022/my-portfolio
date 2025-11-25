"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Home, ChevronRight, X } from "lucide-react";

interface FloatingNavProps {
  backUrl?: string;
}

export default function FloatingNav({ backUrl = "/blog" }: FloatingNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // 点击外部自动关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* ================= PC 端 (xl 以上) ================= */}
      {/* 保持原有的设计：垂直悬浮在内容卡片左侧 */}
      <div className="hidden xl:flex fixed top-1/2 -translate-y-1/2 left-[calc(50%-44rem)] 2xl:left-[calc(50%-46rem)] z-50 flex-col gap-4 transition-all duration-300">
        <Link href={backUrl}>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full w-12 h-12 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-xl shadow-zinc-200/20 dark:shadow-black/40 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 hover:dark:bg-zinc-800 hover:scale-110 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 group"
            title="返回列表"
          >
            <ArrowLeft className="h-8 w-8 group-hover:-translate-x-1 transition-transform duration-300" />
          </Button>
        </Link>
        <Link href="/">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full w-12 h-12 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-xl shadow-zinc-200/20 dark:shadow-black/40 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 hover:dark:bg-zinc-800 hover:scale-110 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 group"
            title="回到首页"
          >
            <Home className="h-8 w-8" />
          </Button>
        </Link>
      </div>

      {/* ================= 移动端 (xl 以下) ================= */}
      {/* 侧边抽屉交互 - 极简版 */}
      <div 
        ref={navRef}
        className="xl:hidden fixed top-32 left-0 z-50 flex items-center gap-3"
      >
        {/* 1. 触发器 (小耳朵) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center justify-center pl-1
            w-8 h-10
            bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md
            border-y border-r border-zinc-200/60 dark:border-zinc-700/60
            rounded-r-xl shadow-md
            text-zinc-500 dark:text-zinc-400
            transition-all duration-300
            hover:w-10 hover:bg-white dark:hover:bg-zinc-800
            z-20
          `}
          aria-label="打开菜单"
        >
          <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* 2. 弹出的按钮组 - 直接展示按钮，无背景卡片 */}
        <div
          className={`
            flex gap-3
            transition-all duration-300 ease-out
            ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0 pointer-events-none"}
          `}
        >
          <Link href={backUrl} onClick={() => setIsOpen(false)}>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full w-10 h-10 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md shadow-lg border border-zinc-200/60 dark:border-zinc-700/60"
              title="返回列表"
            >
               <ArrowLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
            </Button>
          </Link>

          <Link href="/" onClick={() => setIsOpen(false)}>
             <Button
              variant="secondary"
              size="icon"
              className="rounded-full w-10 h-10 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md shadow-lg border border-zinc-200/60 dark:border-zinc-700/60"
              title="回到首页"
            >
               <Home className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

