import FloatingNav from "@/components/FloatingNav";
import ScrollReveal from "@/components/ScrollReveal";
import GitHubStats from "@/components/widgets/GitHubStats";
import ContributionHeatmap from "@/components/widgets/ContributionHeatmap";
import VisitorCounter from "@/components/VisitorCounter";
import Image from "next/image";
import { ArrowRight, Github, Mail, Music } from "lucide-react";

const contacts = [
  { name: "Email", value: "nianshu2022@sina.cn", link: "mailto:nianshu2022@sina.cn", icon: Mail },
  { name: "GitHub", value: "nianshu2022", link: "https://github.com/nianshu2022", icon: Github },
  { name: "网易云音乐", value: "1646904424", link: "https://music.163.com/#/user?id=1646904424", icon: Music },
];

const timeline = [
  { year: "起点", title: "从网络开始", desc: "计算机网络技术让我先看见系统背后的连接、规则和秩序。" },
  { year: "转向", title: "走向产品运营", desc: "进入运营后，我开始更在意人如何理解产品、使用产品，以及为什么留下或离开。" },
  { year: "持续", title: "继续折腾技术", desc: "部署服务、研究开源项目、尝试 AI 工具，是我保持手感和好奇心的方式。" },
  { year: "现在", title: "把经历写下来", desc: "念舒档案局用来存放技术案卷、成长样本和长期复盘。" },
];

const stack = ["Next.js", "Tailwind CSS", "Cloudflare Pages", "Linux / CentOS", "Docker", "AI Tools"];

export default function AboutPage() {
  return (
    <main className="archive-shell">
      <FloatingNav backUrl="/" />

      <section className="grid gap-8 border-y border-foreground/75 py-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
        <ScrollReveal className="min-w-0">
          <div className="archive-growth-media h-full min-h-[420px]">
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

        <ScrollReveal delay={0.15} direction="right" className="min-w-0">
          <div className="flex h-full flex-col justify-between gap-8">
            <div>
              <div className="mb-5 inline-flex border border-primary px-2 py-1 font-mono text-sm font-bold text-primary">
                主理人档案
              </div>
              <h1 className="max-w-4xl text-[clamp(3rem,7vw,5.8rem)] font-black leading-none tracking-normal">
                念舒
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-9 text-muted-foreground">
                我想做的，是把真实的问题看明白，再把它变成可用的体验。
              </p>
            </div>

            <dl className="archive-id-card max-w-2xl">
              <div>
                <dt>身份</dt>
                <dd>00 后技术折腾者 / 产品实践者</dd>
              </div>
              <div>
                <dt>关注</dt>
                <dd>部署、排障、AI 工具、用户价值</dd>
              </div>
              <div>
                <dt>站点</dt>
                <dd>念舒档案局</dd>
              </div>
              <div>
                <dt>状态</dt>
                <dd>
                  持续记录中
                  <span className="archive-live-dot" aria-hidden="true" />
                </dd>
              </div>
            </dl>

            <div className="archive-contact-strip">
              {contacts.map((contact) => (
                <a key={contact.name} href={contact.link} target="_blank" rel="noopener noreferrer">
                  {contact.name}
                  <contact.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="grid gap-8 border-b border-foreground/75 py-10 lg:grid-cols-[1fr_360px]">
        <ScrollReveal className="min-w-0">
          <div>
            <div className="archive-section-heading archive-section-heading-compact">
              <span>01</span>
              <div>
                <h2>成长线索</h2>
                <p>不是完成态简历，而是一个人如何从问题、实践和复盘里慢慢长出自己的系统。</p>
              </div>
            </div>

            <div className="mt-8 border-y border-foreground/60">
              {timeline.map((item) => (
                <div key={item.title} className="grid gap-3 border-b border-border px-4 py-5 last:border-b-0 sm:grid-cols-[5rem_11rem_1fr]">
                  <span className="font-mono text-sm text-primary">{item.year}</span>
                  <strong className="text-xl">{item.title}</strong>
                  <p className="text-sm leading-7 text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="min-w-0">
          <aside className="border border-foreground/50 bg-card/80 p-5">
            <h2 className="text-2xl font-black">常用技术栈</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {stack.map((item) => (
                <span key={item} className="border border-border bg-background/70 px-3 py-1.5 font-mono text-xs text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-6 border-t border-border pt-5 text-sm leading-7 text-muted-foreground">
              这里不只是展示页，而是一个持续更新的公开档案：帮别人少走一点弯路，也帮我自己记住来时的路。
            </div>
            <div className="mt-5 border-t border-border pt-4">
              <VisitorCounter />
            </div>
          </aside>
        </ScrollReveal>
      </section>

      <section className="grid gap-6 py-10 lg:grid-cols-2">
        <ScrollReveal className="min-w-0">
          <div className="border border-foreground/50 bg-card/80 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-black">开源记录</h2>
              <a href="https://github.com/nianshu2022" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary">
                GitHub
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <GitHubStats />
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.15} className="min-w-0">
          <div className="border border-foreground/50 bg-card/80 p-5">
            <h2 className="mb-4 text-2xl font-black">提交热力</h2>
            <ContributionHeatmap />
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
