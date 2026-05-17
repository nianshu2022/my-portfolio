"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import GridBackground from "@/components/GridBackground";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // 检查是否已登录
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("admin_token", data.token);
        router.push("/admin");
      } else {
        setError(data.error || "认证失败，请检查密码");
      }
    } catch (err) {
      setError("网络连接异常");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] text-slate-200">
      <GridBackground />
      
      {/* 装饰性光晕 */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="z-10 w-full max-w-md px-6">
        <div className="garden-panel overflow-hidden border-primary/20 bg-black/40 p-8 backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">管理员认证</h1>
            <p className="mt-2 text-sm text-slate-400">请输入访问令牌进入数字花园指挥中心</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="group relative">
              <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-primary" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="访问令牌 (Access Token)"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white outline-none transition-all focus:border-primary/50 focus:bg-white/10 focus:ring-1 focus:ring-primary/50"
                required
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary py-3 font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  进入控制台
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-white/5 pt-6 text-center">
            <button 
              onClick={() => router.push("/")}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              返回主站
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .garden-panel {
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
        }
        .garden-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(var(--primary), 0.1), transparent);
          pointer-events: none;
        }
      `}</style>
    </main>
  );
}
