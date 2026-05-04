"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Remembers the last scroll position of any page and restores it
 * when the user navigates back via Next.js routing.
 */
export default function ScrollMemory() {
  const pathname = usePathname();
  const shouldSaveOnCleanupRef = useRef(true);

  // Force manual scroll restoration so browser won't override ours
  useEffect(() => {
    if (typeof window === "undefined") return;
    const { scrollRestoration } = window.history;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
      return () => {
        window.history.scrollRestoration = scrollRestoration;
      };
    }
  }, []);

  useEffect(() => {
    if (!pathname || typeof window === "undefined") return;

    const storageKey = `scroll-pos:${pathname}`;
    const savedPosition = sessionStorage.getItem(storageKey);
    shouldSaveOnCleanupRef.current = true;

    // Wait a tick to ensure layout is ready before scrolling
    setTimeout(() => {
      if (savedPosition) {
        window.scrollTo({ top: Number(savedPosition), behavior: "auto" });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    }, 0);

    const saveScrollPosition = () => {
      sessionStorage.setItem(storageKey, String(window.scrollY));
    };
    const manualSaveScrollPosition = () => {
      saveScrollPosition();
      shouldSaveOnCleanupRef.current = false;
    };

    window.addEventListener("beforeunload", manualSaveScrollPosition);
    window.addEventListener("pagehide", manualSaveScrollPosition);

    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (href.startsWith("#")) return;
      manualSaveScrollPosition();
    };

    document.addEventListener("click", handleAnchorClick, true);

    return () => {
      if (shouldSaveOnCleanupRef.current) {
        saveScrollPosition();
      }
      window.removeEventListener("beforeunload", manualSaveScrollPosition);
      window.removeEventListener("pagehide", manualSaveScrollPosition);
      document.removeEventListener("click", handleAnchorClick, true);
    };
  }, [pathname]);

  return null;
}

