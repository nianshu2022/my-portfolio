import FloatingNav from "@/components/FloatingNav";
import ScrollReveal from "@/components/ScrollReveal";
import GitHubStats from "@/components/widgets/GitHubStats";
import ContributionHeatmap from "@/components/widgets/ContributionHeatmap";
import VisitorCounter from "@/components/VisitorCounter";
import Image from "next/image";
import { ArrowRight, Github, Mail, Music } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我",
  description: "念舒的个人简介——一个 00 后技术折腾者，关于经历、做事方法和联系方式。",
};

const contacts = [
  { name: "Email", value: "nianshu2022@sina.cn", link: "mailto:nianshu2022@sina.cn", icon: Mail },
  { name: "GitHub", value: "nianshu2022", link: "https://github.com/nianshu2022", icon: Github },
  { name: "网易云音乐", value: "1646904424", link: "https://music.163.com/#/user?id=1646904424", icon: Music },
];

const timeline = [
  { year: "起点", title: "从网络开始", desc: "计算机网络技术让我先看见系统背后的连接、规则和秩序。" },
  { year: "转向", title: "走向产品运营", desc: "进入运营后，我开始更在意人如何理解产品、使用产品，以及为什么留下或离开。" },
  { year: "持续", title: "继续折腾技术", desc: "部署服务、研究开源项目、尝试 AI 工具，是我保持手感和好奇心的方式。" },
  { year: "现在", title: "把经历写下来", desc: "这个博客用来存放技术笔记、成长随笔和长期复盘。" },
];

const stack = ["Next.js", "Tailwind CSS", "Cloudflare Pages", "Linux / CentOS", "Docker", "AI Tools"];

const principles = [
  {
    title: "先把问题跑通",
    desc: "不急着讲概念，先把服务部署起来、把报错复现出来、把路径摸清楚。",
  },
  {
    title: "记录真实过程",
    desc: "保留踩坑、取舍和修复原因，少写漂亮空话，多写下一次还能用的经验。",
  },
  {
    title: "把技术放回人身上",
    desc: "工具最终要服务使用者：能不能更省事、更稳定、更容易理解，是我判断价值的方式。",
  },
];

const proofFiles = [
  { label: "📝 博客文章", value: "部署 / 排障 / AI 本地化", emoji: "📝" },
  { label: "✍️ 个人随笔", value: "比赛 / 毕业 / 阶段复盘", emoji: "✍️" },
  { label: "🛠️ 公开服务", value: "长期运行 / 持续维护", emoji: "🛠️" },
];

export default function AboutPage() {
  return (
    <main className="ns-shell">
      <FloatingNav backUrl="/" />

      {/* ── Hero ── */}
      <section className="grid gap-10 py-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16 lg:py-12">
        <ScrollReveal className="min-w-0">
          <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "3/4", maxHeight: 480 }}>
            <Image
              src="/img/graduation-profile-2024.jpg"
              alt="念舒的个人照片"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.12} className="min-w-0">
          <div className="flex flex-col gap-6">
            <p className="text-sm font-semibold text-primary">✦ 认识我</p>
            <h1 className="text-5xl font-black leading-tight tracking-tight text-foreground sm:text-6xl">
              你好，我是
              <br />
              <span className="gradient-text">念舒</span>
            </h1>
            <p className="max-w-lg text-lg leading-8 text-muted-foreground">
              一个 00 后技术折腾者。从网络技术、服务部署到产品理解，
              把真实的问题拆开、跑通，再记录下来。
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "坐标", value: "🌏 兰州 · 中国" },
                { label: "身份", value: "00后 · 技术折腾者" },
                { label: "关注", value: "部署 · AI · 产品" },
                { label: "状态", value: "🟢 持续记录中" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-card p-3">
                  <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="flex flex-wrap gap-2">
              {contacts.map((contact) => (
                <a
                  key={contact.name}
                  href={contact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <contact.icon className="h-4 w-4" aria-hidden="true" />
                  {contact.name}
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── What I Do ── */}
      <section className="border-t border-border py-12">
        <ScrollReveal>
          <h2 className="mb-2 text-2xl font-black text-foreground">可信线索</h2>
          <p className="mb-8 text-muted-foreground">不靠一句简介建立人设，用可追溯的文章、随笔和服务说明我在持续做什么。</p>
        </ScrollReveal>
        <div className="grid gap-4 lg:grid-cols-3">
          {proofFiles.map((item, i) => (
            <ScrollReveal key={item.label} delay={i * 0.08}>
              <div className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
                <p className="text-3xl mb-3">{item.emoji}</p>
                <p className="text-sm font-semibold text-primary">{item.label}</p>
                <p className="mt-2 text-base font-bold text-foreground">{item.value}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="grid gap-8 border-t border-border py-12 lg:grid-cols-[1fr_320px]">
        <ScrollReveal className="min-w-0">
          <h2 className="mb-2 text-2xl font-black text-foreground">成长线索</h2>
          <p className="mb-8 text-muted-foreground">不是完成态简历，而是一个人如何从问题、实践和复盘里慢慢长出自己的系统。</p>
          <div className="space-y-0 rounded-2xl border border-border bg-card overflow-hidden">
            {timeline.map((item, i) => (
              <div
                key={item.title}
                className="grid gap-2 border-b border-border px-6 py-5 last:border-b-0 sm:grid-cols-[5rem_11rem_1fr]"
              >
                <span className="text-sm font-bold text-primary">{item.year}</span>
                <strong className="text-base font-black">{item.title}</strong>
                <p className="text-sm leading-7 text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15} className="min-w-0">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-black">常用技术栈</h2>
            <div className="flex flex-wrap gap-2">
              {stack.map((item) => (
                <span key={item} className="skill-pill text-xs">{item}</span>
              ))}
            </div>
            <p className="mt-5 border-t border-border pt-4 text-sm leading-7 text-muted-foreground">
              这里不只是展示页，而是一个持续更新的公开记录：帮别人少走一点弯路，也帮我自己记住来时的路。
            </p>
            <div className="mt-4 border-t border-border pt-4">
              <VisitorCounter />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Principles ── */}
      <section className="border-t border-border py-12">
        <ScrollReveal>
          <h2 className="mb-2 text-2xl font-black text-foreground">做事方法</h2>
          <p className="mb-8 text-muted-foreground">我更相信可验证的手感：少一点口号，多一点能被复用的现场记录。</p>
        </ScrollReveal>
        <div className="grid gap-4 lg:grid-cols-3">
          {principles.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 0.08}>
              <div className="rounded-2xl border border-border bg-card p-6 h-full">
                <span className="text-3xl font-black text-primary/20">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-xl font-black text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── GitHub ── */}
      <section className="grid gap-6 border-t border-border py-12 lg:grid-cols-2">
        <ScrollReveal className="min-w-0">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">开源记录</h2>
              <a
                href="https://github.com/nianshu2022"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent-foreground"
              >
                GitHub
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <GitHubStats />
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.12} className="min-w-0">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-black">提交热力</h2>
            <ContributionHeatmap />
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
