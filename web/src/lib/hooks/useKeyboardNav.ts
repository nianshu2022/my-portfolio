"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useKeyboardNav(selector = "[data-article-link]") {
  const [activeIndex, setActiveIndex] = useState(-1);
  const gPending = useRef(false);
  const gTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const getItems = useCallback(() => {
    return Array.from(document.querySelectorAll<HTMLElement>(selector));
  }, [selector]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      const items = getItems();

      switch (e.key) {
        case "j": {
          e.preventDefault();
          setActiveIndex((prev) => {
            const next = Math.min(prev + 1, items.length - 1);
            items[next]?.scrollIntoView({ behavior: "smooth", block: "center" });
            return next;
          });
          break;
        }
        case "k": {
          e.preventDefault();
          setActiveIndex((prev) => {
            const next = Math.max(prev - 1, 0);
            items[next]?.scrollIntoView({ behavior: "smooth", block: "center" });
            return next;
          });
          break;
        }
        case "g": {
          if (gPending.current) {
            clearTimeout(gTimer.current);
            gPending.current = false;
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActiveIndex(-1);
          } else {
            gPending.current = true;
            gTimer.current = setTimeout(() => {
              gPending.current = false;
            }, 500);
          }
          break;
        }
        case "Escape": {
          setActiveIndex(-1);
          (document.activeElement as HTMLElement)?.blur?.();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [getItems]);

  return { activeIndex };
}
