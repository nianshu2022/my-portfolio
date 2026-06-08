"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  ["技术案卷", "/blog"],
  ["成长样本", "/essays"],
  ["搜索", "/search"],
  ["时间索引", "/archive"],
  ["装备", "/gear"],
  ["在线服务", "/portal"],
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
            className={`group relative px-3 py-2 font-semibold transition-colors hover:bg-secondary hover:text-foreground ${
              isActive ? "bg-secondary text-foreground" : ""
            }`}
          >
            <span className="mr-1 font-mono text-[10px] text-primary opacity-0 transition-opacity group-hover:opacity-100 group-aria-[current=page]:opacity-100">
              {String(index + 1).padStart(2, "0")}
            </span>
            {label}
            <span
              className={`absolute bottom-0 left-3 right-3 h-0.5 bg-primary transition-transform duration-200 ${
                isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
