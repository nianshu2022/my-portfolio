import FloatingNav from "@/components/FloatingNav";
import ScrollReveal from "@/components/ScrollReveal";
import { ShieldAlert, Cookie, Database, Eye, CheckCircle, Info } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "念舒的隐私政策与 Cookie 政策说明，符合 Google AdSense 合作伙伴政策指南。",
};

const sections = [
  {
    title: "隐私声明概述",
    desc: "念舒博客致力于保障各位读者的隐私安全。本页面公开说明本站在提供内容阅读与交互功能时，所涉及的数据收集、使用目的及安全保障措施。",
    icon: ShieldAlert,
    details: "我们不主动收集、不需要也不强制任何读者注册账号，亦不会向任何第三方转售用户的个人隐私信息。"
  },
  {
    title: "第三方广告与 Cookie 政策",
    desc: "为了维持本站的长期服务器带宽与持续创作成本，本站接入了 Google AdSense 广告联盟服务。",
    icon: Cookie,
    details: "根据 Google 合作伙伴政策，我们在此说明：\n1. 第三方广告商（包括 Google）会根据用户此前访问本站或其他网站的记录，使用 Cookie 来投放个性化广告。\n2. Google 对广告 Cookie 的使用，使得它及其合作伙伴可以根据用户对本站和/或互联网上其他网站的访问记录，向用户投放相关广告。\n3. 您可以随时通过访问 Google 广告设置（https://www.google.com/settings/ads）来停用个性化广告推送。"
  },
  {
    title: "本地存储 (LocalStorage) 声明",
    desc: "为了保证用户获得最出色的个性化阅读体验，本站会在您的浏览器本地缓存中记录少量的功能性状态变量，这些数据完全保留在您的客户端，不会传输至我们的服务器。",
    icon: Database,
    details: "具体记录的内容包括：\n- 网页主题偏好（暗黑模式或日间模式）\n- 字号大小设置（小、中、大档位记忆）\n- 文章点赞记录（避免重复提交）"
  },
  {
    title: "外部统计与流量分析服务",
    desc: "为了统计本站文章的阅读热度与访客分布情况，本站嵌入了以下受信任的第三方统计接口：",
    icon: Eye,
    details: "- 不蒜子 (Busuanzi)：用于获取整站 PV/UV 计数以及单篇文章阅读数，仅记录匿名请求特征。\n- Leaflet 访客分布地图：基于匿名访问的粗略地理区域，展示全球读者的分布情况。\n- Giscus 评论区：基于 GitHub Discussions 的开源评论机制，当您发表评论时，会按照 GitHub 开放的鉴权规则读取您的 GitHub 头像与用户名。"
  }
];

export default function PrivacyPage() {
  return (
    <main className="ns-shell">
      <FloatingNav backUrl="/" />

      {/* ── Header ── */}
      <header className="mb-10 border-b border-border pb-10">
        <p className="mb-3 text-sm font-semibold text-primary">✦ 透明 · 开放</p>
        <h1 className="text-5xl font-black leading-tight tracking-tight text-foreground sm:text-6xl">
          <span className="gradient-text">隐私政策</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          最近更新：2026年05月17日。本政策符合 Google 发布商联盟规范及国际隐私保护标准。
        </p>
      </header>

      {/* ── Sections ── */}
      <div className="space-y-4">
        {sections.map((sec, i) => (
          <ScrollReveal key={sec.title} delay={i * 0.08}>
            <article className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <sec.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="text-lg font-black text-foreground">{sec.title}</h2>
                </div>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">{sec.desc}</p>
              <div className="mt-4 rounded-xl bg-secondary/60 p-4 text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {sec.details}
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>

      {/* ── CTA ── */}
      <section className="mt-8">
        <ScrollReveal delay={0.3}>
          <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <h3 className="font-black text-foreground">我们尊重并保护您的数字权利</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  如果您对本隐私声明有任何疑问，或发现任何不合规之处，欢迎随时联系作者。
                </p>
              </div>
            </div>
            <a
              href="mailto:nianshu2022@sina.cn"
              className="btn-primary flex-shrink-0"
            >
              <Info className="h-4 w-4" />
              联系反馈
            </a>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
