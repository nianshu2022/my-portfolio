"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  Shield, 
  Database, 
  Globe, 
  RefreshCcw, 
  CheckCircle2, 
  AlertTriangle,
  Server,
  Loader2,
  Trash2
} from "lucide-react";

type SystemInfo = {
  database: any;
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
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setInfo(await res.json());
    } catch (err) {
      console.error("Fetch info error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchInfo(); }, []);

  const handleCleanStats = async () => {
    if (!confirm("确定要清理无效的浏览统计吗？这可能会影响部分显示数据。")) return;
    
    setIsCleaning(true);
    const token = localStorage.getItem("admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    
    try {
      const res = await fetch(`${apiUrl}/api/admin/clean-stats`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setFeedback("清理成功！");
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch (err) {
      setFeedback("清理失败，请检查网络。");
    } finally {
      setIsCleaning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium tracking-widest uppercase">System Checking...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">系统设置</h1>
        <p className="mt-2 text-slate-400">监控你的数字花园底层运行状况与安全配置。</p>
      </header>

      {/* 状态看板 */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <div className="flex items-center gap-3 text-emerald-400">
            <Server className="h-5 w-5" />
            <h2 className="font-bold">运行环境</h2>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">部署平台</span>
              <span className="text-slate-200">{info?.platform}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">运行时</span>
              <span className="text-slate-200">{info?.runtime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">边缘节点</span>
              <span className="text-slate-200 font-mono text-xs">{info?.location}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <div className="flex items-center gap-3 text-blue-400">
            <Database className="h-5 w-5" />
            <h2 className="font-bold">数据统计</h2>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">数据库类型</span>
              <span className="text-slate-200">Cloudflare D1 (SQLite)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">总记录数</span>
              <span className="text-slate-200">{(
                Object.values(info?.database || {}).reduce((a: any, b: any) => a + b, 0) as number
              )} 条</span>
            </div>
          </div>
        </div>
      </div>

      {/* 安全中心 */}
      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-bold text-white px-2">
          <Shield className="h-5 w-5 text-amber-500" />
          安全与令牌
        </h3>
        <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="mt-1 h-5 w-5 text-amber-500 shrink-0" />
            <div className="flex-1 space-y-2">
              <p className="text-sm font-bold text-amber-200">正在使用环境变量管理权限</p>
              <p className="text-xs text-amber-200/60 leading-relaxed">
                当前的 Web 后台访问令牌存储在 Cloudflare Workers 的 Secrets 中。如需修改，请在本地终端执行：
                <code className="mx-1 rounded bg-black/30 px-1 py-0.5 text-amber-400 font-mono">wrangler secret put ADMIN_PASSWORD</code>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 数据维护 */}
      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-bold text-white px-2">
          <Settings className="h-5 w-5 text-primary" />
          数据维护
        </h3>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">清理无效浏览数据</p>
              <p className="text-xs text-slate-500">清除没有对应文章记录的冗余统计条目。</p>
            </div>
            <button 
              onClick={handleCleanStats}
              disabled={isCleaning}
              className="flex items-center gap-2 rounded-xl bg-rose-500/10 px-4 py-2 text-sm font-bold text-rose-500 transition-all hover:bg-rose-500/20 disabled:opacity-50"
            >
              {isCleaning ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              执行清理
            </button>
          </div>
          {feedback && (
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 animate-in fade-in slide-in-from-left-2">
              <CheckCircle2 className="h-3 w-3" />
              {feedback}
            </div>
          )}
        </div>
      </section>

      <footer className="pt-10 text-center">
        <p className="text-xs text-slate-600">念舒的数字花园 · Admin Console v1.0.0</p>
      </footer>
    </div>
  );
}
