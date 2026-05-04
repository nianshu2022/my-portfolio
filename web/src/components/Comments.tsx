"use client";

import Giscus from "@giscus/react";
import { useEffect, useState } from "react";

export default function Comments() {
    const [theme, setTheme] = useState("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Initial check
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "transparent_dark" : "light");

        // Observe class changes on html element
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes" && mutation.attributeName === "class") {
                    const isDarkNow = document.documentElement.classList.contains("dark");
                    setTheme(isDarkNow ? "transparent_dark" : "light");
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    if (!mounted) return null;

    return (
        <div id="comments-section" className="w-full mt-10 pt-10 border-t border-zinc-200/50 dark:border-zinc-700/50">
            <h2 className="text-xl font-bold mb-8 text-zinc-900 dark:text-zinc-100 font-serif flex items-center gap-2">
                <span>💬 评论</span>
            </h2>
            <Giscus
                id="comments"
                repo="nianshu2022/my-portfolio"
                repoId="R_kgDONsxn0Q"
                category="Announcements"
                categoryId="DIC_kwDONsxn0c4CmQ_u"
                mapping="pathname"
                term="Welcome to my blog!"
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
