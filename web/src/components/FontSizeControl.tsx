"use client";

import { useEffect, useState } from "react";
import { ALargeSmall } from "lucide-react";

type FontSize = "sm" | "md" | "lg";

const SIZES: { key: FontSize; label: string; px: number }[] = [
    { key: "sm", label: "小", px: 15 },
    { key: "md", label: "中", px: 17 },
    { key: "lg", label: "大", px: 20 },
];

const STORAGE_KEY = "article-font-size";

export default function FontSizeControl() {
    const [size, setSize] = useState<FontSize>("md");

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY) as FontSize | null;
        if (saved && SIZES.find((s) => s.key === saved)) {
            setSize(saved);
            applySize(saved);
        }
    }, []);

    const applySize = (s: FontSize) => {
        const px = SIZES.find((x) => x.key === s)!.px;
        document.documentElement.style.setProperty("--article-font-size", `${px}px`);
    };

    const change = (s: FontSize) => {
        setSize(s);
        applySize(s);
        localStorage.setItem(STORAGE_KEY, s);
    };

    return (
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/50 dark:border-zinc-700/50">
            <ALargeSmall className="w-4 h-4 text-zinc-400 ml-1 shrink-0" />
            {SIZES.map((s) => (
                <button
                    key={s.key}
                    onClick={() => change(s.key)}
                    title={`字号：${s.label}`}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        size === s.key
                            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    }`}
                >
                    {s.label}
                </button>
            ))}
        </div>
    );
}
