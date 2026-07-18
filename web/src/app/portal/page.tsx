import fs from "fs";
import path from "path";
import FloatingNav from "@/components/FloatingNav";
import ScrollReveal from "@/components/ScrollReveal";
import { Activity, Clock, ExternalLink, LockKeyhole, Server, Tv, WifiOff } from "lucide-react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "服务",
  description: "念舒长期维护的公开入口和自托管服务状态。",
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

const statusStyles: Record<ServiceStatus, { dot: string; badge: string }> = {
  online: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  protected: {
    dot: "bg-amber-500",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  degraded: {
    dot: "bg-orange-500",
    badge: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  },
  offline: {
    dot: "bg-red-500",
    badge: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
};

export default function PortalPage() {
  const payload = readPortalStatus();
  const services = payload?.services ?? [];
  const lastCheckedAt = payload?.generatedAt ?? "未生成";
  const online = services.filter((s) =>
    ["online", "protected"].includes(s.check.status)
  ).length;

  return (
    <main className="ns-shell">
      <FloatingNav backUrl="/" />

      {/* ── Page Header ── */}
      <header className="mb-10 border-b border-border pb-10">
        <p className="mb-3 text-sm font-semibold text-primary">自托管 · 长期维护</p>
        <h1 className="text-5xl font-black leading-tight tracking-tight text-foreground sm:text-6xl">
          <span className="gradient-text">在线服务</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          这里记录我长期维护的公开入口和自托管服务。能访问的不一定复杂，但都是真实运行过的东西。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-foreground">{online} 项</span>
            <span className="text-muted-foreground">正在运行</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground">
            共 {services.length} 项服务
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
            检查时间：{lastCheckedAt}
          </div>
        </div>
      </header>

      {/* ── Services Grid ── */}
      <div className="space-y-3">
        {services.map((service, i) => {
          const CategoryIcon = iconMap[service.iconKey] || Server;
          const style = statusStyles[service.check.status] || statusStyles.offline;

          return (
            <ScrollReveal key={service.name} delay={i * 0.06}>
              <a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                {/* Service Icon */}
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary/50">
                  <Image
                    src={service.icon}
                    alt={service.name}
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                    unoptimized
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground transition-colors group-hover:text-primary">
                      {service.name}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                    {service.visibility === "protected" && (
                      <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                        <LockKeyhole className="h-3 w-3" />
                        私有
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </div>

                {/* Status & Meta */}
                <div className="hidden flex-shrink-0 flex-col items-end gap-2 sm:flex">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${style.badge}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                    {formatStatus(service.check.status)}
                  </span>
                  <span className="flex gap-2 text-xs text-muted-foreground">
                    {typeof service.check.statusCode === "number" && (
                      <span>HTTP {service.check.statusCode}</span>
                    )}
                    {typeof service.check.latencyMs === "number" && (
                      <span>{service.check.latencyMs} ms</span>
                    )}
                  </span>
                </div>

                <CategoryIcon className="h-5 w-5 flex-shrink-0 text-primary/40 group-hover:text-primary transition-colors" />
              </a>
            </ScrollReveal>
          );
        })}
      </div>
    </main>
  );
}
