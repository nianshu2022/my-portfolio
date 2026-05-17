"use client";

import { useState, useEffect } from "react";
import { 
  Eye, 
  Heart, 
  MessageSquare, 
  BookOpen, 
  TrendingUp, 
  Clock,
  ExternalLink,
  Loader2,
  Activity
} from "lucide-react";
import Link from "next/link";

type Stats = {
  total_views: number;
  total_likes: number;
  total_comments: number;
  total_posts: number;
};

type GardenActivity = {
  type: "comment" | "favorite";
  user: string;
  msg: string;
  time: string;
  slug: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<GardenActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      try {
        const headers = { "Authorization": `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

        const [statsRes, activitiesRes] = await Promise.all([
          fetch(`${apiUrl}/api/admin/stats`, { headers }),
          fetch(`${apiUrl}/api/admin/activities`, { headers }),
        ]);

        if (statsRes.ok && activitiesRes.ok) {
          const statsData = await statsRes.json();
          const activitiesData = await activitiesRes.json();
          // stats 可能直接是对象也可能在 results 数组里
          setStats(statsData.results?.[0] || statsData[0] || statsData);
          setActivities(activitiesData.results || activitiesData);
        }
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium tracking-widest uppercase">Syncing Data...</p>
      </div>
    );
  }

  const statCards = [
    { label: "全站访问", value: stats?.total_views || 0, icon: Eye, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "累计获赞", value: stats?.total_likes || 0, icon: Heart, color: "text-rose-400", bg: "bg-rose-400/10" },
    { label: "留言互动", value: stats?.total_comments || 0, icon: MessageSquare, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "文章总数", value: stats?.total_posts || 0, icon: BookOpen, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">数字花园指挥中心</h1>
        <p className="mt-2 text-slate-400">欢迎回来，这是你全站运行的实时状态。</p>
      </header>

      {/* 指标网格 */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => (
          <div key={i} className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-primary/30 hover:bg-white/[0.04]">
            <div className="flex items-center justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <TrendingUp className="h-4 w-4 text-slate-600 group-hover:text-primary transition-colors" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-white">{card.value.toLocaleString()}</p>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 最近动态 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              <Clock className="h-5 w-5 text-primary" />
              全站实时动态
            </h2>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 divide-y divide-white/5">
            {activities.length > 0 ? activities.map((activity, i) => (
              <div key={i} className="flex items-start gap-4 py-4 first:pt-2 last:pb-2">
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${activity.type === 'comment' ? 'bg-emerald-500' : 'bg-rose-500'} shadow-[0_0_8px_rgba(var(--color),0.5)]`} />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-200">
                      <span className="text-primary">{activity.user}</span> {activity.msg}
                    </p>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">
                      {new Date(activity.time).toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">来源文章: </span>
                    <Link href={`/blog/${activity.slug}`} target="_blank" className="flex items-center gap-1 text-xs text-slate-400 hover:text-primary transition-colors">
                      {activity.slug}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center text-sm text-slate-500">暂无最新动态</div>
            )}
          </div>
        </div>

        {/* 快速管理入口 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white px-2">常用操作</h2>
          <div className="grid gap-3">
            {[
              { title: "发布新文章", desc: "同步本地 Markdown", path: "/admin/posts", icon: BookOpen },
              { title: "处理新留言", desc: "回复用户评论", path: "/admin/comments", icon: MessageSquare },
              { title: "站点维护", desc: "查看系统健康度", path: "/admin/health", icon: Activity },
            ].map((item, i) => (
              <Link key={i} href={item.path} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.05] hover:border-white/10 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
