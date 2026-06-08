import FloatingNav from "@/components/FloatingNav";
import ScrollReveal from "@/components/ScrollReveal";
import TiltCard from "@/components/TiltCard";
import { ShieldAlert, Cookie, Database, Eye, CheckCircle, Info } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "念舒档案局隐私政策与 Cookie 政策说明，符合 Google AdSense 合作伙伴政策指南。",
};

const sections = [
  {
    title: "1. 隐私声明概述",
    desc: "念舒档案局（以下简称“本站”）致力于保障各位读者的隐私安全。本页面旨在公开、透明地向您说明本站在提供内容阅读与交互功能时，所涉及的数据收集、使用目的及安全保障措施。",
    icon: ShieldAlert,
    details: "我们不主动收集、不需要也不强制任何读者注册账号，亦不会向任何第三方转售用户的个人隐私信息。"
  },
  {
    title: "2. 第三方广告与 Cookie 政策 (重要)",
    desc: "为了维持本站的长期服务器带宽与持续创作成本，本站接入了 Google AdSense 广告联盟服务。",
    icon: Cookie,
    details: "根据 Google 合作伙伴政策，我们在此说明：\n1. 第三方广告商（包括 Google）会根据用户此前访问本站或其他网站的记录，使用 Cookie 来投放个性化广告。\n2. Google 对广告 Cookie 的使用，使得它及其合作伙伴可以根据用户对本站和/或互联网上其他网站的访问记录，向用户投放精准且相关的广告。\n3. 您可以随时通过访问【Google 广告设置】（https://www.google.com/settings/ads）来停用个性化广告推送。您亦可访问 www.aboutads.info 拒绝第三方广告商对 Cookie 的追踪投放。"
  },
  {
    title: "3. 本地存储 (LocalStorage) 声明",
    desc: "为了保证用户获得最出色的个性化阅读体验，本站会在您的浏览器本地缓存（LocalStorage）中记录少量的功能性状态变量，这些数据完全保留在您的客户端，不会传输至我们的服务器。",
    icon: Database,
    details: "具体记录的内容包括：\n- 网页主题偏好（Theme Preference：暗黑模式或日间模式）\n- 字号大小设置（Font Size Settings：小、中、大档位记忆）\n- 文章点赞记录（Like status：避免重复提交点赞心形动效）"
  },
  {
    title: "4. 外部统计与流量分析服务",
    desc: "为了统计本站文章的阅读热度与访客分布情况，本站嵌入了以下受信任的第三方静态统计和评论接口：",
    icon: Eye,
    details: "- 不蒜子 (Busuanzi)：用于获取整站 PV/UV 计数以及单篇文章阅读数，仅记录匿名请求特征。\n- Leaflet 访客分布地图：基于您匿名访问的粗略地理区域，在首页地图组件中展示全球读者的分布情况。\n- Giscus 评论区：基于 GitHub Discussions 的开源评论机制，当您发表评论时，会按照 GitHub 开放的鉴权规则读取您的 GitHub 头像与用户名。"
  }
];

export default function PrivacyPage() {
  return (
    <main className="garden-shell">
      <FloatingNav backUrl="/" />

      <section className="space-y-8 border-b border-border pb-10 sm:pb-14">
        <ScrollReveal>
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Info className="h-3.5 w-3.5" />
              <span>COMPLIANCE POLICY</span>
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl">
              隐私政策与 Cookie 声明
            </h1>
            <p className="garden-subtitle">
              最近更新日期：2026年05月17日。本政策页面符合 Google 发布商联盟规范及国际隐私保护标准。
            </p>
          </div>
        </ScrollReveal>
      </section>

      <section className="py-10 sm:py-14 grid gap-6 md:grid-cols-2">
        {sections.map((sec, i) => (
          <ScrollReveal key={sec.title} delay={i * 0.1} className="min-w-0">
            <TiltCard className="h-full">
              <div className="garden-panel p-6 h-full flex flex-col justify-between transition-all hover:border-primary/30 hover:shadow-[0_0_25px_rgba(99,102,241,0.08)]">
                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <sec.icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">{sec.title}</h2>
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">{sec.desc}</p>
                </div>
                <div className="mt-6 border-t border-border/60 pt-4 text-xs leading-relaxed text-muted-foreground/80 font-sans whitespace-pre-wrap">
                  {sec.details}
                </div>
              </div>
            </TiltCard>
          </ScrollReveal>
        ))}
      </section>

      <section className="py-10 sm:py-12 border-t border-border">
        <ScrollReveal delay={0.4}>
          <TiltCard>
            <div className="brand-panel p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  我们尊重并保护您的数字权利
                </h3>
                <p className="text-sm text-muted-foreground max-w-2xl leading-6">
                  念舒档案局完全建立在透明、开放、可追溯的静态 Serverless 架构之上。如果您对本隐私声明有任何疑问，或发现任何不合规之处，欢迎随时与作者取得联系。
                </p>
              </div>
              <a
                href="mailto:nianshu2022@sina.cn"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 shrink-0"
              >
                联系作者反馈
              </a>
            </div>
          </TiltCard>
        </ScrollReveal>
      </section>
    </main>
  );
}
