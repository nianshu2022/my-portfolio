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
        setTimeout(() => setAnimating(false), 600);
    };

    return (
        <button
            onClick={toggle}
            title={liked ? "感谢你的喜欢！" : "喜欢这篇文章"}
            className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                liked
                    ? "bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 border-rose-200 dark:border-rose-800 cursor-default"
                    : "bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-200 dark:hover:border-rose-800 border-zinc-200/50 dark:border-zinc-700/50"
            }`}
        >
            <Heart
                className={`w-4 h-4 transition-transform duration-300 ${
                    animating ? "scale-150" : "scale-100"
                } ${liked ? "fill-rose-500 text-rose-500" : "group-hover:text-rose-400"}`}
            />
            {liked ? "已喜欢 ♥" : "喜欢"}
        </button>
    );
}
