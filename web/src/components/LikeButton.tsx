"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
    slug: string;
}

export default function LikeButton({ slug }: LikeButtonProps) {
    const [liked, setLiked] = useState(false);
    const [animating, setAnimating] = useState(false);
    const storageKey = `liked:${slug}`;

    useEffect(() => {
        setLiked(localStorage.getItem(storageKey) === "1");
    }, [storageKey]);

    const toggle = () => {
        if (liked) return; // once liked, can't unlike (intentional)
        setAnimating(true);
        setLiked(true);
        localStorage.setItem(storageKey, "1");
        setTimeout(() => setAnimating(false), 700);
    };

    return (
        <button
            onClick={toggle}
            title={liked ? "感谢你的喜欢！" : "喜欢这篇文章"}
            className={`group relative flex items-center gap-2 overflow-hidden px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                liked
                    ? "bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 border-rose-200 dark:border-rose-800 cursor-default"
                    : "bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-200 dark:hover:border-rose-800 border-zinc-200/50 dark:border-zinc-700/50"
            }`}
        >
            {/* Shimmer sweep on like — UIverse style */}
            {animating && (
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: "linear-gradient(90deg, transparent, rgba(244,63,94,0.18), transparent)",
                        animation: "btn-shimmer 0.65s ease forwards",
                    }}
                />
            )}

            {/* Heart icon with burst ring */}
            <span className="relative flex items-center justify-center">
                <Heart
                    className={`w-4 h-4 transition-all duration-500 ${
                        animating ? "scale-[1.7]" : "scale-100"
                    } ${liked ? "fill-rose-500 text-rose-500" : "group-hover:text-rose-400"}`}
                />
                {/* Expanding ring burst */}
                {animating && (
                    <span
                        aria-hidden="true"
                        className="absolute inset-[-6px] rounded-full border-2 border-rose-400"
                        style={{ animation: "heart-ring 0.55s ease-out forwards" }}
                    />
                )}
            </span>

            {liked ? "已喜欢 ♥" : "喜欢"}
        </button>
    );
}
