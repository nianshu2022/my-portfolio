"use client";

import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";

interface ShareButtonProps {
    title: string;
    url?: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);
    const [open, setOpen] = useState(false);

    const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");

    const handleShare = async () => {
        // Try native share first (mobile)
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({ title, url: shareUrl });
                return;
            } catch {
                // user cancelled or not supported
            }
        }
        setOpen((v) => !v);
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 bg-zinc-100/80 dark:bg-zinc-800/80 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 border border-zinc-200/50 dark:border-zinc-700/50 transition-all duration-200"
                title="分享文章"
            >
                <Share2 className="w-4 h-4" />
                分享
            </button>

            {open && (
                <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl p-3 flex flex-col gap-2 min-w-[160px] z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                    {/* Copy Link */}
                    <button
                        onClick={copyLink}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
                        {copied ? "已复制！" : "复制链接"}
                    </button>

                    {/* Weibo */}
                    <a
                        href={`https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        onClick={() => setOpen(false)}
                    >
                        <span className="w-4 h-4 flex items-center justify-center text-red-500 font-bold text-xs">微</span>
                        新浪微博
                    </a>

                    {/* Twitter/X */}
                    <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        onClick={() => setOpen(false)}
                    >
                        <span className="w-4 h-4 flex items-center justify-center font-bold text-xs">𝕏</span>
                        Twitter / X
                    </a>
                </div>
            )}

            {/* Backdrop */}
            {open && (
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            )}
        </div>
    );
}
