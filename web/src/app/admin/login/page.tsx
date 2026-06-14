"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) router.push("/admin");
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
        setError(data.error || "认证失败，请检查访问令牌。");
      }
    } catch {
      setError("网络连接异常，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="admin-workbench flex min-h-screen items-center justify-center px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden border-y border-foreground/70 bg-background/88 md:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden border-r border-foreground/45 p-8 md:block">
          <div className="admin-page-kicker">PRIVATE DESK</div>
          <h1 className="mt-8 max-w-sm text-[clamp(3.2rem,7vw,5.6rem)] font-black leading-none tracking-normal">
            内部档案台
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">
            用来查看内容状态、读者留言、运行健康度和站点维护记录。这里不展示人设，只处理真实运行问题。
          </p>
          <div className="mt-10 grid max-w-sm border border-border font-mono text-xs">
            <div className="grid grid-cols-[5rem_1fr] border-b border-border">
              <span className="border-r border-border px-3 py-2 text-muted-foreground">编号</span>
              <span className="px-3 py-2 font-bold">ADMIN-2001</span>
            </div>
            <div className="grid grid-cols-[5rem_1fr]">
              <span className="border-r border-border px-3 py-2 text-muted-foreground">权限</span>
              <span className="px-3 py-2 font-bold text-primary">令牌认证</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="admin-panel admin-panel-pad mx-auto max-w-md">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center border border-primary bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="admin-page-kicker">ACCESS CHECK</div>
              <h2 className="text-3xl font-black tracking-normal">管理员认证</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">输入访问令牌后进入档案局内部工作台。</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <label className="block">
                <span className="mb-2 block font-mono text-xs font-bold text-muted-foreground">访问令牌</span>
                <span className="relative block">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Access Token"
                    className="admin-input pl-10"
                    required
                  />
                </span>
              </label>

              {error && <div className="border border-primary bg-primary/10 px-3 py-2 text-sm text-primary">{error}</div>}

              <button type="submit" disabled={isLoading} className="admin-button w-full">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>进入控制台 <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>

            <button onClick={() => router.push("/")} className="mt-6 font-mono text-xs text-muted-foreground hover:text-primary">
              返回主站
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
