import fs from "fs";
import path from "path";
import FloatingNav from "@/components/FloatingNav";
import ScrollReveal from "@/components/ScrollReveal";
import { Activity, Clock, ExternalLink, LockKeyhole, Server, Tv, WifiOff } from "lucide-react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "我的传送门",
  description: "私有部署服务与站点入口。",
};

type ServiceStatus = "online" | "protected" | "degraded" | "offline";

type PortalStatusPayload = {
  generatedAt: string;
  source: string;
  timeoutMs: number;
  services: Array<{
    name: string;
    description: string;
    url: string;
    icon: string;
    iconKey: "clock" | "tv" | "server";
    visibility: "public" | "protected";
    check: {
      status: ServiceStatus;
      statusCode: number | null;
      latencyMs: number | null;
      message: string;
    };
  }>;
};

const iconMap: Record<string, LucideIcon> = {
  clock: Clock,
  tv: Tv,
  server: Server,
};

function readPortalStatus(): PortalStatusPayload | null {
  try {
    const statusPath = path.join(process.cwd(), "public", "portal-status.json");
    const raw = fs.readFileSync(statusPath, "utf8");
    return JSON.parse(raw) as PortalStatusPayload;
  } catch {
    return null;
  }
}

function formatStatus(status: ServiceStatus): string {
  if (status === "online") return "运行中";
  if (status === "protected") return "受限可达";
  if (status === "degraded") return "状态异常";
  return "不可达";
}

export default function PortalPage() {
  const payload = readPortalStatus();
  const services = payload?.services ?? [];
  const lastCheckedAt = payload?.generatedAt ?? "未生成";
  const statusSource = payload?.source ?? "未生成状态文件";

  return (
    <main className="garden-shell">
      <FloatingNav backUrl="/" />

      <header className="mb-10 border-b border-border pb-8">
        <p className="garden-kicker inline-flex items-center gap-2">
          <Server className="h-4 w-4" /> 服务状态
        </p>
        <h1 className="garden-title mt-3">我的传送门</h1>
        <p className="garden-subtitle mt-3 max-w-2xl">我自托管服务的统一入口。部分服务仅对授权用户开放。</p>
        <details className="mt-4 rounded-md border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
          <summary className="cursor-pointer select-none text-sm font-medium text-foreground">状态检查信息</summary>
          <div className="mt-2 space-y-1">
            <p>状态来源：{statusSource}</p>
            <p>最近检查：{lastCheckedAt}</p>
          </div>
        </details>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => {
          const CategoryIcon = iconMap[service.iconKey] || Server;
          const statusMap: Record<ServiceStatus, string> = {
            online: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
            protected: "border-amber-500/30 text-amber-600 dark:text-amber-400",
            degraded: "border-orange-500/30 text-orange-600 dark:text-orange-400",
            offline: "border-red-500/30 text-red-600 dark:text-red-400",
          };
          const statusClass = statusMap[service.check.status] || statusMap.offline;
          return (
            <ScrollReveal key={service.name} delay={i * 0.08}>
              <a href={service.url} target="_blank" rel="noopener noreferrer" className="garden-panel group block p-5 transition-all hover:border-primary/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border bg-background p-2">
                      <Image src={service.icon} alt={service.name} width={32} height={32} className="h-8 w-8 object-contain" unoptimized />
                    </div>
                    <CategoryIcon className="h-5 w-5 text-primary" />
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${statusClass}`}>
                    {service.check.status === "online" || service.check.status === "protected" ? <Activity className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                    {formatStatus(service.check.status)}
                  </span>
                </div>
                <h2 className="flex items-center gap-2 text-xl font-semibold group-hover:text-primary">
                  {service.name}
                  <ExternalLink className="h-4 w-4" />
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{service.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {typeof service.check.statusCode === "number" && (
                    <span className="rounded-md border border-border bg-background px-2 py-1">HTTP {service.check.statusCode}</span>
                  )}
                  {typeof service.check.latencyMs === "number" && (
                    <span className="rounded-md border border-border bg-background px-2 py-1">{service.check.latencyMs} ms</span>
                  )}
                  {service.visibility === "protected" && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1">
                      <LockKeyhole className="h-3 w-3" /> 私有服务
                    </span>
                  )}
                </div>
              </a>
            </ScrollReveal>
          );
        })}
      </div>
    </main>
  );
}
