"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, BookOpen, Clock, ExternalLink, Eye, Heart, Loader2, MessageSquare, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import { analyzeSuspiciousText, compactUntrustedText } from "@/lib/admin-security";

type Stats = {
  total_views: number;
  total_likes: number;
  total_comments: number;
  total_posts: number;
};

type ArchiveActivity = {
  type: "comment" | "favorite";
  user: string;
  msg: string;
  time: string;
  slug: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<ArchiveActivity[]>([]);
  const [activityFilter, setActivityFilter] = useState<"all" | "risk">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const [statsRes, activitiesRes] = await Promise.all([
          fetch(`${apiUrl}/api/admin/stats`, { headers }),
          fetch(`${apiUrl}/api/admin/activities`, { headers }),
        ]);

        if (statsRes.ok && activitiesRes.ok) {
          const statsData = await statsRes.json();
          const activitiesData = await activitiesRes.json();
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
      <div className="admin-loading">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
        <p className="font-mono text-xs font-bold">同步运行数据</p>
      </div>
    );
  }

  const statCards = [
    { label: "全站访问", value: stats?.total_views || 0, icon: Eye },
    { label: "累计获赞", value: stats?.total_likes || 0, icon: Heart },
    { label: "留言互动", value: stats?.total_comments || 0, icon: MessageSquare },
    { label: "文章总数", value: stats?.total_posts || 0, icon: BookOpen },
  ];
  const activityReports = activities.map((activity) => ({
    activity,
    risk: analyzeSuspiciousText(activity.user, activity.msg, activity.slug),
  }));
  const riskyActivities = activityReports.filter((item) => item.risk.flagged);
  const visibleActivities = activityFilter === "risk" ? riskyActivities : activityReports;
  const riskSummary = riskyActivities.reduce<Record<string, number>>((summary, item) => {
    item.risk.labels.forEach((label) => {
      summary[label] = (summary[label] || 0) + 1;
    });
    return summary;
  }, {});

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <div className="admin-page-kicker">ADMIN-OVERVIEW</div>
          <h1 className="admin-page-title">数据概览</h1>
          <p className="admin-page-desc">查看全站访问、互动、内容和最近动作，判断档案局是否持续稳定运行。</p>
        </div>
        <div className={`admin-stamp ${riskyActivities.length > 0 ? "border-primary text-primary" : ""}`}>
          {riskyActivities.length > 0 ? <AlertTriangle className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
          {riskyActivities.length > 0 ? `可疑动态 ${riskyActivities.length}` : "正常运行"}
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <div key={card.label} className="admin-panel admin-panel-pad group">
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
              <card.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            </div>
            <p className="mt-5 text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-1 font-mono text-3xl font-black tabular-nums text-foreground">{card.value.toLocaleString()}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="admin-panel">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="flex items-center gap-2 text-xl font-black">
              <Clock className="h-5 w-5 text-primary" />
              实时动态
            </h2>
            <div className="inline-flex border border-border bg-background font-mono text-xs font-bold">
              <button
                type="button"
                onClick={() => setActivityFilter("all")}
                className={`px-3 py-1.5 ${activityFilter === "all" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                全部 {activities.length}
              </button>
              <button
                type="button"
                onClick={() => setActivityFilter("risk")}
                className={`border-l border-border px-3 py-1.5 ${activityFilter === "risk" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"}`}
              >
                可疑 {riskyActivities.length}
              </button>
            </div>
          </div>
          <div className="divide-y divide-border">
            {visibleActivities.length > 0 ? visibleActivities.map(({ activity, risk }, index) => {

              return (
                <div
                  key={`${activity.slug}-${index}`}
                  className={`grid gap-3 px-5 py-4 sm:grid-cols-[7rem_1fr_auto] ${risk.flagged ? "bg-primary/5" : ""}`}
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    {new Date(activity.time).toLocaleString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <div className="min-w-0">
                    {risk.flagged ? (
                      <div>
                        <p className="text-sm font-semibold text-primary">可疑探测内容已折叠</p>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">{risk.labels.join(" / ")}</p>
                        <details className="mt-2">
                          <summary className="cursor-pointer font-mono text-xs text-muted-foreground hover:text-primary">查看原始文本</summary>
                          <pre className="mt-2 whitespace-pre-wrap break-all border border-border bg-background p-3 font-mono text-xs text-muted-foreground">
                            {`user: ${compactUntrustedText(activity.user, 160)}\nmsg: ${compactUntrustedText(activity.msg, 240)}\nslug: ${compactUntrustedText(activity.slug, 240)}`}
                          </pre>
                        </details>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-semibold">
                          <span className="text-primary">{activity.user}</span> {activity.msg}
                        </p>
                        <Link href={`/blog/${activity.slug}`} target="_blank" className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-primary">
                          {activity.slug}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </>
                    )}
                  </div>
                  <span className={`self-start border px-2 py-1 font-mono text-[10px] ${risk.flagged ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
                    {risk.flagged ? "RISK" : activity.type === "comment" ? "COMMENT" : "LIKE"}
                  </span>
                </div>
              );
            }) : (
              <div className="px-5 py-14 text-center text-sm text-muted-foreground">
                {activityFilter === "risk" ? "暂无可疑动态" : "暂无最新动态"}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="admin-panel admin-panel-pad">
            <h2 className="flex items-center gap-2 text-xl font-black">
              {riskyActivities.length > 0 ? <AlertTriangle className="h-5 w-5 text-primary" /> : <ShieldCheck className="h-5 w-5 text-emerald-600" />}
              风险摘要
            </h2>
            <div className="mt-5 grid grid-cols-2 border border-border">
              <div className="border-r border-border p-4">
                <p className="font-mono text-xs text-muted-foreground">可疑动态</p>
                <p className="mt-2 font-mono text-3xl font-black text-primary">{riskyActivities.length}</p>
              </div>
              <div className="p-4">
                <p className="font-mono text-xs text-muted-foreground">风险类型</p>
                <p className="mt-2 font-mono text-3xl font-black">{Object.keys(riskSummary).length}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {Object.entries(riskSummary).length > 0 ? Object.entries(riskSummary).map(([label, count]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActivityFilter("risk")}
                  className="admin-muted-box flex w-full items-center justify-between p-3 text-left hover:border-primary"
                >
                  <span className="text-sm font-bold">{label}</span>
                  <span className="font-mono text-xs text-primary">{count} 条</span>
                </button>
              )) : (
                <div className="admin-muted-box p-4 text-sm text-muted-foreground">暂无命中规则，动态展示为正常。</div>
              )}
            </div>
          </div>

          <div className="admin-panel admin-panel-pad">
            <h2 className="text-xl font-black">常用操作</h2>
            <div className="mt-5 grid gap-3">
              {[
                { title: "发布新文章", desc: "同步本地 Markdown", path: "/admin/posts", icon: BookOpen },
                { title: "处理新留言", desc: "回复用户评论", path: "/admin/comments", icon: MessageSquare },
                { title: "站点维护", desc: "查看系统健康度", path: "/admin/health", icon: TrendingUp },
              ].map((item, index) => (
                <Link key={item.path} href={item.path} className="admin-muted-box flex items-center gap-3 p-4 hover:border-primary">
                  <span className="font-mono text-xs font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span>
                    <span className="block text-sm font-bold">{item.title}</span>
                    <span className="block text-xs text-muted-foreground">{item.desc}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
