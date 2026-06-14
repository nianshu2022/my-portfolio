"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  ChevronRight,
  Database,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  UserCircle,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "数据概览", path: "/admin", icon: LayoutDashboard, code: "A-01" },
  { name: "文章管理", path: "/admin/posts", icon: FileText, code: "A-02" },
  { name: "评论管理", path: "/admin/comments", icon: MessageSquare, code: "A-03" },
  { name: "健康监控", path: "/admin/health", icon: Activity, code: "A-04" },
  { name: "全站设置", path: "/admin/settings", icon: Settings, code: "A-05" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token && pathname !== "/admin/login") {
      router.replace("/admin/login");
      return;
    }
    setIsAuthorized(true);
  }, [pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;

  if (isAuthorized === null) {
    return (
      <div className="admin-workbench flex h-screen items-center justify-center">
        <div className="admin-stamp">初始化内部档案台</div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.replace("/");
  };

  return (
    <div className="admin-workbench flex min-h-screen">
      <div className="fixed left-0 right-0 top-0 z-40 border-b border-foreground/35 bg-background/95 px-3 py-2 backdrop-blur md:hidden">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="font-black">内部档案台</Link>
          <button onClick={handleLogout} className="font-mono text-xs text-muted-foreground">退出</button>
        </div>
        <nav className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`shrink-0 border px-2 py-1.5 font-mono text-[10px] font-bold ${
                  isActive ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                }`}
              >
                {item.code}
              </Link>
            );
          })}
        </nav>
      </div>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-foreground/40 bg-background/92 backdrop-blur md:block">
        <div className="flex h-full flex-col p-5">
          <Link href="/admin" className="border-b border-foreground/45 pb-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center border border-foreground bg-foreground text-background">
                <Database className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-black leading-none text-foreground">内部档案台</h2>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">ARCHIVE DESK</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-[4rem_1fr] border border-border bg-card/70 font-mono text-xs">
              <span className="border-r border-border px-2 py-2 text-muted-foreground">编号</span>
              <span className="px-2 py-2 font-bold">ADMIN-2001</span>
              <span className="border-r border-t border-border px-2 py-2 text-muted-foreground">状态</span>
              <span className="border-t border-border px-2 py-2 font-bold text-primary">运行中</span>
            </div>
          </Link>

          <nav className="mt-6 flex-1 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`group flex items-center justify-between border px-3 py-3 text-sm transition-colors ${
                    isActive
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-transparent text-muted-foreground hover:border-border hover:bg-card/70 hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-[10px] font-bold text-primary">{item.code}</span>
                    <Icon className="h-4 w-4" />
                    <span className="font-bold">{item.name}</span>
                  </span>
                  {isActive && <ChevronRight className="h-4 w-4 text-primary" />}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-foreground/45 pt-4">
            <div className="mb-3 flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
              <UserCircle className="h-4 w-4" />
              <span>管理员席位</span>
            </div>
            <button onClick={handleLogout} className="admin-button-secondary w-full justify-start">
              <LogOut className="h-4 w-4" />
              退出系统
            </button>
          </div>
        </div>
      </aside>

      <main className="w-full px-4 pb-10 pt-24 md:ml-72 md:px-8 md:pt-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
