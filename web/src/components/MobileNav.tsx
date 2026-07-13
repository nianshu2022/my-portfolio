"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  ["博客", "/blog"],
  ["随笔", "/essays"],
  ["搜索", "/search"],
  ["归档", "/archive"],
  ["装备", "/gear"],
  ["服务", "/portal"],
  ["关于", "/about"],
] as const;

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
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
      {/* Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="打开导航菜单"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div
            ref={panelRef}
            className="absolute right-0 top-0 flex h-full w-72 max-w-[86vw] flex-col rounded-l-2xl border-l border-border bg-card/95 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right duration-200"
          >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <div>
                <p className="text-xs font-semibold text-primary">念舒</p>
                <p className="text-sm font-black text-foreground">导航</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-secondary hover:text-foreground"
                aria-label="关闭导航菜单"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="space-y-1">
                {navLinks.map(([label, href]) => {
                  const isActive = pathname === href || pathname.startsWith(href + "/");
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150 ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        {isActive && (
                          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="border-t border-border px-5 py-4 text-xs text-muted-foreground">
              念舒 · 技术 · 成长 · 创造
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
