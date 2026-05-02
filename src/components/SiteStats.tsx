import { FileText, Feather, Tag, BarChart3, TrendingUp } from "lucide-react";
import { getSiteStats } from "@/lib/site-stats";

const statIcons = [FileText, Feather, Tag, BarChart3];

export default function SiteStats() {
  const stats = getSiteStats();

  const cards = [
    { label: "技术文章", value: stats.totalPosts, icon: FileText },
    { label: "生活随笔", value: stats.totalEssays, icon: Feather },
    { label: "标签总数", value: stats.totalTags, icon: Tag },
    { label: "平均字数", value: stats.avgWordCount.toLocaleString(), icon: BarChart3 },
  ];

  return (
    <div className="garden-panel p-5">
      <div className="mb-5 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">站点统计</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="text-center">
            <card.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
            <div className="text-2xl font-semibold">{card.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{card.label}</div>
          </div>
        ))}
      </div>
      {stats.topTags.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="mb-2 text-xs text-muted-foreground">热门标签</p>
          <div className="flex flex-wrap gap-2">
            {stats.topTags.map((t) => (
              <span key={t.tag} className="inline-flex items-center gap-1 rounded-md border border-border bg-background/70 px-2.5 py-1 text-sm text-muted-foreground">
                {t.tag}
                <span className="text-xs text-primary">{t.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
