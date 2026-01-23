"use client";

import Giscus from "@giscus/react";
import { useEffect, useState } from "react";

export default function Comments() {
  // Handle theme for Giscus
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Initial check - use requestAnimationFrame to avoid synchronous setState warning
    const handle = requestAnimationFrame(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "transparent_dark" : "light");
    });

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "transparent_dark" : "light");
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      cancelAnimationFrame(handle);
      observer.disconnect();
    };
  }, []);

  const isConfigured =
    process.env.NEXT_PUBLIC_GISCUS_REPO &&
    process.env.NEXT_PUBLIC_GISCUS_REPO_ID &&
    process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  return (
    <div className="mt-16 pt-10 border-t border-zinc-200/50 dark:border-zinc-700/50 w-full">
      <div className="mb-8 flex items-center gap-2">
        <span className="text-xl">💬</span>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">评论区</h3>
      </div>

      {isConfigured ? (
        <Giscus
          id="comments"
          repo={process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`}
          repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID!}
          category="Announcements"
          categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!}
          mapping="pathname"
          term="Welcome to @giscus/react component!"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={theme}
          lang="zh-CN"
          loading="lazy"
        />
      ) : (
        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 text-center">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            评论系统尚未配置。请在 <code className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-mono text-xs">.env.local</code> 中配置 Giscus 相关变量。
          </p>
        </div>
      )}
    </div>
  );
}
