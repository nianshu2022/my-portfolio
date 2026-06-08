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
        <div className="flex items-center gap-1 border border-border bg-card p-1 font-mono">
            <ALargeSmall className="ml-1 h-4 w-4 shrink-0 text-muted-foreground" />
            {SIZES.map((s) => (
                <button
                    key={s.key}
                    onClick={() => change(s.key)}
                    title={`字号：${s.label}`}
                    className={`px-2.5 py-1 text-xs font-medium transition-colors duration-200 ${
                        size === s.key
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                >
                    {s.label}
                </button>
            ))}
        </div>
    );
}
