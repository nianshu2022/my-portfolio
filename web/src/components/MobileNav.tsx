"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  ["技术案卷", "/blog"],
  ["成长样本", "/essays"],
  ["搜索", "/search"],
  ["时间索引", "/archive"],
  ["装备", "/gear"],
  ["在线服务", "/portal"],
  ["关于", "/about"],
] as const;

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="打开导航菜单"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            className="absolute right-0 top-0 flex h-full w-80 max-w-[86vw] flex-col border-l border-foreground/40 bg-card shadow-2xl animate-in slide-in-from-right duration-200"
          >
            <div className="flex h-16 items-center justify-between border-b border-foreground/30 px-5">
              <div className="grid">
                <span className="font-mono text-[10px] text-primary">PUBLIC ARCHIVE 001</span>
                <span className="text-sm font-black text-foreground">案卷目录</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="关闭导航菜单"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3">
              {navLinks.map(([label, href], index) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`grid grid-cols-[2.5rem_1fr] items-center border-b border-border px-3 py-4 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <span className="font-mono text-primary">{String(index + 1).padStart(2, "0")}</span>
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-foreground/30 p-4 font-mono text-xs text-muted-foreground">
              NIANSHU ARCHIVES · 中国 / 兰州
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
