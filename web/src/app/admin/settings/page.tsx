"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Database, Loader2, RefreshCcw, Server, Settings, Shield, Trash2 } from "lucide-react";

type SystemInfo = {
  database: Record<string, number>;
  platform: string;
  runtime: string;
  location: string;
};

export default function AdminSettingsPage() {
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCleaning, setIsCleaning] = useState(false);
  const [feedback, setFeedback] = useState("");

  const fetchInfo = async () => {
    const token = localStorage.getItem("admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    try {
      const res = await fetch(`${apiUrl}/api/admin/health`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setInfo(await res.json());
    } catch (err) {
      console.error("Fetch info error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleCleanStats = async () => {
    if (!confirm("确定要清理无效的浏览统计吗？这可能会影响部分显示数据。")) return;

    setIsCleaning(true);
    const token = localStorage.getItem("admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    try {
      const res = await fetch(`${apiUrl}/api/admin/clean-stats`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setFeedback("清理成功");
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch {
      setFeedback("清理失败，请检查网络。");
    } finally {
      setIsCleaning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
        <p className="font-mono text-xs font-bold">读取系统设置</p>
      </div>
    );
  }

  const totalRecords = Object.values(info?.database || {}).reduce((total, count) => total + count, 0);

  return (
    <div className="admin-page max-w-5xl">
      <header className="admin-page-header">
        <div>
          <div className="admin-page-kicker">SYSTEM SETTINGS</div>
          <h1 className="admin-page-title">系统设置</h1>
          <p className="admin-page-desc">管理后台运行信息、安全令牌说明和低频维护操作。</p>
        </div>
        <div className="admin-stamp">Admin v1.0.4</div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="admin-panel admin-panel-pad">
          <h2 className="mb-5 flex items-center gap-2 text-xl font-black">
            <Server className="h-5 w-5 text-primary" />
            运行环境
          </h2>
          <dl className="grid border border-border font-mono text-xs">
            <div className="grid grid-cols-[6rem_1fr] border-b border-border">
              <dt className="border-r border-border px-3 py-2 text-muted-foreground">平台</dt>
              <dd className="px-3 py-2 font-bold">{info?.platform}</dd>
            </div>
            <div className="grid grid-cols-[6rem_1fr] border-b border-border">
              <dt className="border-r border-border px-3 py-2 text-muted-foreground">运行时</dt>
              <dd className="px-3 py-2 font-bold">{info?.runtime}</dd>
            </div>
            <div className="grid grid-cols-[6rem_1fr]">
              <dt className="border-r border-border px-3 py-2 text-muted-foreground">节点</dt>
              <dd className="px-3 py-2 font-bold">{info?.location}</dd>
            </div>
          </dl>
        </div>

        <div className="admin-panel admin-panel-pad">
          <h2 className="mb-5 flex items-center gap-2 text-xl font-black">
            <Database className="h-5 w-5 text-primary" />
            数据统计
          </h2>
          <dl className="grid border border-border font-mono text-xs">
            <div className="grid grid-cols-[6rem_1fr] border-b border-border">
              <dt className="border-r border-border px-3 py-2 text-muted-foreground">数据库</dt>
              <dd className="px-3 py-2 font-bold">Cloudflare D1</dd>
            </div>
            <div className="grid grid-cols-[6rem_1fr]">
              <dt className="border-r border-border px-3 py-2 text-muted-foreground">记录数</dt>
              <dd className="px-3 py-2 font-bold">{totalRecords} 条</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="admin-panel admin-panel-pad">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
          <Shield className="h-5 w-5 text-primary" />
          安全与令牌
        </h2>
        <div className="flex gap-4 border border-primary/40 bg-primary/5 p-4">
          <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-primary" />
          <div className="space-y-2">
            <p className="text-sm font-bold">后台访问令牌由环境变量管理</p>
            <p className="text-sm leading-7 text-muted-foreground">
              当前 Web 后台访问令牌存储在 Cloudflare Workers Secrets 中。如需修改，请在本地终端执行
              <code className="mx-1 border border-border bg-background px-1.5 py-0.5 font-mono text-xs text-primary">wrangler secret put ADMIN_PASSWORD</code>
              后重新部署后端服务。
            </p>
          </div>
        </div>
      </section>

      <section className="admin-panel admin-panel-pad">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
          <Settings className="h-5 w-5 text-primary" />
          数据维护
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold">清理无效浏览数据</p>
            <p className="mt-1 text-sm text-muted-foreground">清除没有对应文章记录的冗余统计条目。</p>
          </div>
          <button onClick={handleCleanStats} disabled={isCleaning} className="admin-button-secondary">
            {isCleaning ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            执行清理
          </button>
        </div>
        {feedback && (
          <div className="mt-4 flex items-center gap-2 font-mono text-xs font-bold text-primary">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {feedback}
          </div>
        )}
      </section>
    </div>
  );
}
