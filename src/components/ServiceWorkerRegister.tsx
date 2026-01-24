"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
    useEffect(() => {
        // Service Worker 已禁用，以解决在特定网络环境下的加载阻塞问题。
        // if (process.env.NODE_ENV === 'production' && "serviceWorker" in navigator) {
        //     navigator.serviceWorker
        //         .register("/sw.js")
        //         .then((registration) => {
        //             console.log("Service Worker registered with scope:", registration.scope);
        //         })
        //         .catch((error) => {
        //             console.error("Service Worker registration failed:", error);
        //         });
        // }
    }, []);

    return null;
}
