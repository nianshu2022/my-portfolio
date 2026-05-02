"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Keyboard } from "lucide-react";

const SHORTCUTS = [
  { key: "J / K", desc: "上/下篇" },
  { key: "G G", desc: "回顶部" },
  { key: "/", desc: "搜索" },
  { key: "Esc", desc: "关闭" },
];

const SHOW_PATHS = ["/blog", "/essays", "/archive"];

export default function KeyboardHint() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const shouldShow = SHOW_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  useEffect(() => {
    if (!shouldShow) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 5000);
    const showAgain = () => {
      setVisible(true);
      clearTimeout(timer);
    };
    window.addEventListener("scroll", showAgain, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", showAgain);
    };
  }, [shouldShow, pathname]);

  if (!shouldShow) return null;

  return (
    <div
      className={`fixed bottom-24 right-16 z-40 xl:bottom-8 transition-opacity duration-300 ${visible || open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="relative">
        {open && (
          <div className="absolute bottom-10 right-0 w-48 rounded-lg border border-border bg-card/95 p-3 shadow-lg backdrop-blur-sm">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">快捷键</p>
            <div className="space-y-1.5">
              {SHORTCUTS.map((s) => (
                <div key={s.key} className="flex items-center justify-between text-xs">
                  <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px]">{s.key}</span>
                  <span className="text-muted-foreground">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="rounded-full border border-border bg-card/80 p-2 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:text-foreground"
          aria-label="快捷键提示"
        >
          <Keyboard className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
