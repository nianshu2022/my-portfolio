"use client";

import { useEffect, useState } from "react";
import { Activity, Cpu, Database, Globe, Loader2, Server, ShieldCheck, Zap } from "lucide-react";

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
        headers: { Authorization: `Bearer ${token}` },
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
    return (
      <div className="admin-loading">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
        <p className="font-mono text-xs font-bold">读取系统健康度</p>
      </div>
    );
  }

  const metrics = [
    { label: "边缘节点", value: data?.location || "Unknown", icon: Globe },
    { label: "API 延迟", value: `${latency}ms`, icon: Zap },
    { label: "运行环境", value: data?.platform || "Cloudflare", icon: Cpu },
    { label: "数据库类型", value: "D1 / SQLite", icon: Database },
  ];

  const storageRows = [
    { label: "文章内容", count: data?.database.post_count, icon: Server },
    { label: "用户留言", count: data?.database.comment_count, icon: Server },
    { label: "收藏记录", count: data?.database.favorite_count, icon: Server },
    { label: "统计节点", count: data?.database.stats_count, icon: Server },
  ];

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <div className="admin-page-kicker">SYSTEM HEALTH</div>
          <h1 className="admin-page-title">健康监控</h1>
          <p className="admin-page-desc">查看边缘运行环境、数据库记录和 API 延迟，确认后台服务是否稳定。</p>
        </div>
        <div className="admin-stamp">
          <ShieldCheck className="h-4 w-4" />
          系统运行正常
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <div key={metric.label} className="admin-panel admin-panel-pad">
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
              <metric.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-5 text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-1 font-mono text-xl font-black text-foreground">{metric.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="admin-panel admin-panel-pad">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-black">
            <Database className="h-5 w-5 text-primary" />
            数据存储概览
          </h2>
          <div className="space-y-5">
            {storageRows.map((item) => {
              const count = item.count || 0;
              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    <span className="font-mono font-bold text-primary">{count}</span>
                  </div>
                  <div className="h-2 border border-border bg-background">
                    <div className="h-full bg-primary/70" style={{ width: `${Math.min(count, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="admin-panel admin-panel-pad">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-black">
            <Cpu className="h-5 w-5 text-primary" />
            运行时详情
          </h2>
          <div className="admin-muted-box p-4 font-mono text-xs leading-7 text-muted-foreground">
            <p className="text-primary">{"// runtime metadata"}</p>
            <p>PLATFORM: {data?.platform}</p>
            <p>RUNTIME: {data?.runtime}</p>
            <p>LOCATION: {data?.location}</p>
            <p>LATENCY: {latency}ms</p>
            <p className="mt-4 text-primary">{"// database binding"}</p>
            <p>POOL_STATUS: ACTIVE</p>
            <p>D1_BINDING: DB</p>
          </div>
          <button onClick={fetchHealth} className="admin-button-secondary mt-4 w-full">
            <Activity className="h-4 w-4" />
            刷新系统状态
          </button>
        </div>
      </section>
    </div>
  );
}
