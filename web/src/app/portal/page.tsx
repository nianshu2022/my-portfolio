import fs from "fs";
import path from "path";
import FloatingNav from "@/components/FloatingNav";
import ScrollReveal from "@/components/ScrollReveal";
import { Activity, Clock, ExternalLink, LockKeyhole, Server, Tv, WifiOff } from "lucide-react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "公开服务",
  description: "念舒档案局公开服务登记表与运行状态。",
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
    <main className="archive-shell max-w-6xl">
      <FloatingNav backUrl="/" />

      <header className="mb-10 border-y border-foreground/80 py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 border border-primary px-2 py-1 font-mono text-sm font-bold text-primary">
              <Server className="h-4 w-4" />
              SERVICE REGISTRY
            </p>
            <h1 className="mt-5 text-[clamp(3rem,8vw,5.8rem)] font-black leading-none tracking-normal text-foreground">
              公开服务
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              这里记录我长期维护的公开入口和自托管服务。能访问的不一定复杂，但都是真实运行过的东西。
            </p>
          </div>
          <dl className="grid min-w-72 border border-foreground/50 bg-card/80 font-mono text-xs">
            <div className="grid grid-cols-[5rem_1fr] border-b border-border px-4 py-2">
              <dt className="text-muted-foreground">服务</dt>
              <dd className="font-bold text-foreground">{services.length} 项</dd>
            </div>
            <div className="grid grid-cols-[5rem_1fr] border-b border-border px-4 py-2">
              <dt className="text-muted-foreground">来源</dt>
              <dd className="truncate">{statusSource}</dd>
            </div>
            <div className="grid grid-cols-[5rem_1fr] px-4 py-2">
              <dt className="text-muted-foreground">检查</dt>
              <dd className="truncate">{lastCheckedAt}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="border-y border-foreground/70">
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
              <a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-4 border-b border-border px-4 py-5 transition-colors last:border-b-0 hover:bg-secondary/70 lg:grid-cols-[4rem_1fr_8rem_8rem_7rem] lg:items-center"
              >
                <span className="font-mono text-lg font-black text-primary">
                  {String(i + 1).padStart(3, "0")}
                </span>
                <span className="flex min-w-0 items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-background p-2">
                      <Image src={service.icon} alt={service.name} width={32} height={32} className="h-8 w-8 object-contain" unoptimized />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-xl font-black group-hover:text-primary">
                      {service.name}
                      <ExternalLink className="h-4 w-4" />
                    </span>
                    <span className="mt-1 block line-clamp-2 text-sm leading-6 text-muted-foreground">{service.description}</span>
                  </span>
                </span>
                <span className={`inline-flex w-fit items-center gap-1 border px-2 py-1 text-xs ${statusClass}`}>
                  {service.check.status === "online" || service.check.status === "protected" ? <Activity className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                  {formatStatus(service.check.status)}
                </span>
                <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {typeof service.check.statusCode === "number" && (
                    <span className="border border-border bg-background px-2 py-1">HTTP {service.check.statusCode}</span>
                  )}
                  {typeof service.check.latencyMs === "number" && (
                    <span className="border border-border bg-background px-2 py-1">{service.check.latencyMs} ms</span>
                  )}
                  {service.visibility === "protected" && (
                    <span className="inline-flex items-center gap-1 border border-border bg-background px-2 py-1">
                      <LockKeyhole className="h-3 w-3" /> 私有服务
                    </span>
                  )}
                </span>
                <span className="hidden items-center justify-end text-primary lg:flex">
                  <CategoryIcon className="h-5 w-5" />
                </span>
              </a>
            </ScrollReveal>
          );
        })}
      </div>
    </main>
  );
}
