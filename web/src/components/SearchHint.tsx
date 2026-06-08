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
            className="hidden h-9 items-center gap-2 border border-border bg-card/80 px-3 text-xs text-muted-foreground backdrop-blur-md transition-colors hover:border-primary hover:text-foreground md:flex"
        >
            <Search className="w-3.5 h-3.5" />
            <span>搜索</span>
            <kbd className="border border-border bg-secondary px-1 py-0.5 font-mono text-[10px]">
                {isMac ? "⌘" : "Ctrl"}+K
            </kbd>
        </button>
    );
}
