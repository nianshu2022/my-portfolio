"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
    children?: React.ReactNode;
}

export default function CodeBlock({ children, className, ...props }: CodeBlockProps) {
    const [isCopied, setIsCopied] = useState(false);
    const textRef = React.useRef<HTMLPreElement>(null);

    const handleCopy = async () => {
        if (!textRef.current) return;

        try {
            // 获取纯文本内容
            const text = textRef.current.innerText;
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy code:", err);
        }
    };

    return (
        <div className="group relative my-6 rounded-xl overflow-hidden bg-[#1e1e1e] dark:bg-[#0d1117] border border-zinc-200/20 dark:border-zinc-700/50 shadow-2xl">
            {/* Mac-style Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] dark:bg-[#161b22] border-b border-zinc-700/50">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors shadow-inner" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 transition-colors shadow-inner" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 transition-colors shadow-inner" />
                </div>

                {/* Language Label (Optional, extracted from class if needed, but simple copy button for now) */}
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="复制"
                    aria-label="复制代码"
                >
                    {isCopied ? (
                        <Check className="w-4 h-4 text-green-400" />
                    ) : (
                        <Copy className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Code Content */}
            <div className="relative overflow-x-auto custom-scrollbar">
                {/* 
          这里使用 pre 标签是为了保持 Markdown 渲染的语义，
          props 传递也是为了兼容 react-markdown 的 expectations 
        */}
                <pre
                    ref={textRef}
                    {...props}
                    className={`!m-0 !p-6 !bg-transparent text-sm font-mono leading-relaxed text-zinc-100 ${className || ''}`}
                    style={{ fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace" }}
                >
                    {children}
                </pre>
            </div>
        </div>
    );
}
