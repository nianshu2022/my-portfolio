"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Activity,
  ChevronRight,
  UserCircle
} from "lucide-react";

const NAV_ITEMS = [
  { name: "数据概览", path: "/admin", icon: LayoutDashboard },
  { name: "文章管理", path: "/admin/posts", icon: FileText },
  { name: "评论管理", path: "/admin/comments", icon: MessageSquare },
  { name: "全站设置", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token && pathname !== "/admin/login") {
      router.replace("/admin/login");
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (isAuthorized === null) return <div className="flex h-screen items-center justify-center bg-[#050505] text-white">初始化指挥中心...</div>;

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.replace("/");
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-slate-200">
      {/* 侧边栏 */}
      <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="flex h-full flex-col p-4">
          <div className="mb-10 flex items-center gap-3 px-2 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary ring-1 ring-primary/30">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Garden Admin</h2>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">Digital Command</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 ${
                    isActive 
                      ? "bg-primary/10 text-primary ring-1 ring-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-300"}`} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/5 pt-4">
            <div className="mb-4 flex items-center gap-3 px-4 py-3 text-slate-400">
              <UserCircle className="h-5 w-5" />
              <span className="text-sm">管理员</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="h-5 w-5" />
              <span>退出系统</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>

      {/* 装饰性背景 */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary),0.03),transparent_40%)]" />
    </div>
  );
}
