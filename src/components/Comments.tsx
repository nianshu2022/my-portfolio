"use client";

import Giscus from "@giscus/react";
import { useEffect, useState } from "react";

export default function Comments() {
  // Handle theme for Giscus
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Simple check for system preference or class-based dark mode
    // Since we use Tailwind 'dark' class on html/body
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "transparent_dark" : "light");

    // Optional: Listen for theme changes if you add a theme toggler later
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          setTheme(isDark ? "transparent_dark" : "light");
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-16 pt-10 border-t border-zinc-200/50 dark:border-zinc-700/50 w-full">
      <div className="mb-8 flex items-center gap-2">
        <span className="text-xl">💬</span>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">评论区</h3>
      </div>
      
      <Giscus
        id="comments"
        repo="nianshu2022/my-portfolio"
        repoId="R_kgDOQaY3gQ" 
        category="Announcements"
        categoryId="DIC_kwDOQaY3gc4CyEnq" 
        mapping="pathname"
        term="Welcome to @giscus/react component!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme}
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  );
}

