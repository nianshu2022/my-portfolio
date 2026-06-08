"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Feather, Archive, Info, Home } from "lucide-react";

const navItems = [
  { label: "首页", href: "/", icon: Home },
  { label: "案卷", href: "/blog", icon: BookOpen },
  { label: "样本", href: "/essays", icon: Feather },
  { label: "索引", href: "/archive", icon: Archive },
  { label: "关于", href: "/about", icon: Info },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-foreground/15 bg-background/90 backdrop-blur-md md:hidden">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-around">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex flex-1 flex-col items-center gap-0.5 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span
                className={`absolute top-0 h-0.5 w-8 bg-primary transition-transform ${
                  isActive ? "scale-x-100" : "scale-x-0"
                }`}
              />
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
