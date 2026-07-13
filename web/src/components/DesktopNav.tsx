"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  ["博客", "/blog"],
  ["随笔", "/essays"],
  ["搜索", "/search"],
  ["归档", "/archive"],
  ["装备", "/gear"],
  ["服务", "/portal"],
  ["关于", "/about"],
] as const;

export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
      {navLinks.map(([label, href], index) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");

        return (
        <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`group relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-secondary hover:text-foreground ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {label}
            <span
              className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary transition-transform duration-200 ${
                isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
