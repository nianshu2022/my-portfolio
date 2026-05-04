"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

/**
 * 右上角搜索入口提示按钮。
 * 点击后触发 Ctrl+K 键盘事件，打开 CommandMenu。
 * 仅在桌面端显示（sm 以上），移动端空间有限隐藏。
 */
export default function SearchHint() {
    const [isMac, setIsMac] = useState(false);

    useEffect(() => {
        setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
    }, []);

    const open = () => {
        document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "k", ctrlKey: !isMac, metaKey: isMac, bubbles: true })
        );
    };

    return (
        <button
            onClick={open}
            title="搜索 (Ctrl+K)"
            className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl border border-zinc-200/70 dark:border-zinc-700/70 bg-white/70 dark:bg-zinc-800/70 backdrop-blur-md text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all shadow-sm"
        >
            <Search className="w-3.5 h-3.5" />
            <span>搜索</span>
            <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 font-mono text-[10px]">
                {isMac ? "⌘" : "Ctrl"}+K
            </kbd>
        </button>
    );
}
