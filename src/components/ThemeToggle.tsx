"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // 读取 localStorage 或系统偏好
        const stored = localStorage.getItem("theme");
        if (stored === "dark" || stored === "light") {
            setTheme(stored);
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark");
        }
    }, []);

    const reflectTheme = (newTheme: "light" | "dark") => {
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", newTheme);
    };

    // Initial load reflection is handled by useEffect below, but let's keep it clean
    useEffect(() => {
        if (!mounted) return;
        reflectTheme(theme);
    }, [theme, mounted]);

    const toggle = () => {
        const newTheme = theme === "dark" ? "light" : "dark";

        // 如果浏览器不支持 View Transitions，直接切换
        if (!document.startViewTransition) {
            setTheme(newTheme);
            return;
        }

        // 使用 View Transitions API
        const transition = document.startViewTransition(() => {
            setTheme(newTheme);
            // 立即生效 CSS 变化，以便 transition 捕获新状态
            reflectTheme(newTheme);
        });

        transition.ready.then(() => {
            // 计算扩散圆的半径 (从右上角按钮中心开始)
            // 假设按钮位于右上角 approx 80px from right, 80px from top
            // 更精确的做法是获取点击时的 event coordinates，但这里简化为右上角扩散
            const x = window.innerWidth - 50;
            const y = 50;
            const endRadius = Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y)
            );

            // 定义动画
            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${endRadius}px at ${x}px ${y}px)`,
                    ],
                },
                {
                    duration: 500,
                    easing: "ease-in-out",
                    // 指定 pseudo-element
                    pseudoElement: "::view-transition-new(root)",
                }
            );
        });
    };

    if (!mounted) {
        return (
            <button className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 w-9 h-9" aria-label="Toggle theme">
                <span className="sr-only">Loading theme</span>
            </button>
        );
    }

    return (
        <button
            onClick={toggle}
            className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shadow-sm border border-zinc-200 dark:border-zinc-700 relative overflow-hidden"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
            {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
                <Moon className="w-5 h-5 text-zinc-600" />
            )}
        </button>
    );
}
