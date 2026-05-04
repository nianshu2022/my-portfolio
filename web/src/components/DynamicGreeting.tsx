"use client";

import { useEffect, useState } from "react";

export default function DynamicGreeting() {
    const [greeting, setGreeting] = useState("你好");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const updateGreeting = () => {
            const now = new Date();
            const hour = now.getHours();

            if (hour >= 5 && hour < 12) {
                setGreeting("早上好");
            } else if (hour >= 12 && hour < 14) {
                setGreeting("中午好");
            } else if (hour >= 14 && hour < 19) {
                setGreeting("下午好");
            } else if (hour >= 19 && hour < 24) {
                setGreeting("晚上好");
            } else {
                setGreeting("夜深了");
            }
        };

        updateGreeting();
        // Update every minute (optional, but good for long sessions)
        const interval = setInterval(updateGreeting, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return <span className="opacity-0" suppressHydrationWarning>你好</span>;

    return <span suppressHydrationWarning>{greeting}</span>;
}
