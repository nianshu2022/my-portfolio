"use client";

import { usePathname } from "next/navigation";
import React from "react";

/**
 * 该组件用于在管理后台页面 (/admin) 隐藏主站的导航和辅助组件
 */
export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 如果路径以 /admin 开头，则不渲染包裹的内容
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <>{children}</>;
}
