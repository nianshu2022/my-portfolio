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

    // SSR placeholder — same size as the real toggle to avoid layout shift
    if (!mounted) {
        return (
            <div
                className="h-7 w-[3.25rem] rounded-full border border-border bg-secondary opacity-50"
                aria-label="Toggle theme"
            />
        );
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={toggle}
            className={`relative h-7 w-[3.25rem] flex-shrink-0 rounded-full border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isDark
                    ? "border-primary/40 bg-primary/15"
                    : "border-border bg-secondary"
            }`}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {/* Track background icons (decorative) */}
            <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 flex items-center justify-between px-[7px] transition-opacity duration-200 ${isDark ? "opacity-0" : "opacity-35"}`}
            >
                <Sun className="h-3 w-3 text-amber-500" />
                <span />
            </span>
            <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 flex items-center justify-between px-[7px] transition-opacity duration-200 ${isDark ? "opacity-35" : "opacity-0"}`}
            >
                <span />
                <Moon className="h-3 w-3 text-primary" />
            </span>

            {/* Sliding knob */}
            <span
                className={`absolute top-[3px] flex h-5 w-5 items-center justify-center rounded-full bg-card shadow-sm transition-all duration-300 ${
                    isDark ? "left-[calc(100%-1.375rem)]" : "left-[3px]"
                }`}
            >
                {isDark ? (
                    <Moon className="h-[11px] w-[11px] text-primary" />
                ) : (
                    <Sun className="h-[11px] w-[11px] text-amber-500" />
                )}
            </span>
        </button>
    );
}
