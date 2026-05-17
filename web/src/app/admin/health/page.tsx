"use client";

import { useState, useEffect } from "react";
import { 
  Activity, 
  Server, 
  Database, 
  Globe, 
  Cpu,
  Zap,
  Loader2,
  ShieldCheck
} from "lucide-react";

type HealthData = {
  database: {
    post_count: number;
    comment_count: number;
    favorite_count: number;
    stats_count: number;
  };
  platform: string;
  runtime: string;
  location: string;
};

export default function AdminHealthPage() {
  const [data, setData] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [latency, setLatency] = useState<number | null>(null);

  const fetchHealth = async () => {
    const startTime = Date.now();
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/admin/health`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setData(await res.json());
        setLatency(Date.now() - startTime);
      }
    } catch (err) {
      console.error("Health check failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center text-slate-400"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const metrics = [
    { label: "边缘节点 (Colo)", value: data?.location || "Unknown", icon: Globe, color: "text-blue-400" },
    { label: "API 延迟", value: `${latency}ms`, icon: Zap, color: "text-amber-400" },
    { label: "运行环境", value: data?.platform || "Cloudflare", icon: Cpu, color: "text-emerald-400" },
    { label: "数据库类型", value: "D1 (SQLite)", icon: Database, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">系统健康监控</h1>
          <p className="mt-1 text-sm text-slate-400">底层架构状态与数据吞吐实时观测。</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400">
          <ShieldCheck className="h-4 w-4" /> 系统运行正常
        </div>
      </header>

      {/* 核心指标 */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 ${m.color}`}>
                <m.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{m.label}</p>
                <p className="text-lg font-bold text-white">{m.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* 数据库统计 */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
          <div className="mb-8 flex items-center gap-3 text-lg font-bold text-white">
            <Database className="h-5 w-5 text-primary" />
            数据存储概览
          </div>
          <div className="space-y-6">
            {[
              { label: "文章内容", count: data?.database.post_count, icon: Server },
              { label: "用户留言", count: data?.database.comment_count, icon: Server },
              { label: "收藏记录", count: data?.database.favorite_count, icon: Server },
              { label: "统计节点", count: data?.database.stats_count, icon: Server },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="font-mono text-primary">{item.count}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div 
                    className="h-full bg-primary/40 transition-all duration-1000" 
                    style={{ width: `${Math.min((item.count || 0) / 100 * 100, 100)}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 运行时信息 */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
          <div className="mb-8 flex items-center gap-3 text-lg font-bold text-white">
            <Cpu className="h-5 w-5 text-primary" />
            Edge Runtime 详情
          </div>
          <div className="space-y-4">
            <div className="rounded-xl bg-white/5 p-4 font-mono text-xs leading-relaxed text-slate-400">
              <p className="mb-2 text-primary">{"// 运行时元数据"}</p>
              <p>PLATFORM: {data?.platform}</p>
              <p>RUNTIME: {data?.runtime}</p>
              <p>LOCATION: {data?.location}</p>
              <p>LATENCY: {latency}ms</p>
              <p className="mt-4 text-emerald-500/70">{"// 数据库连接池"}</p>
              <p>POOL_STATUS: ACTIVE</p>
              <p>D1_BINDING: DB (nianshu-garden-db)</p>
            </div>
            <button 
              onClick={fetchHealth}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-sm font-bold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              <Activity className="h-4 w-4" /> 刷新系统状态
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
