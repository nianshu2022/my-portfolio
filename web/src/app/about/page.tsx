import FloatingNav from "@/components/FloatingNav";
import ScrollReveal from "@/components/ScrollReveal";
import TiltCard from "@/components/TiltCard";
import GitHubStats from "@/components/widgets/GitHubStats";
import ContributionHeatmap from "@/components/widgets/ContributionHeatmap";
import MusicChart from "@/components/widgets/MusicChart";
import VisitorMap from "@/components/widgets/VisitorMap";
import VisitorCounter from "@/components/VisitorCounter";
import Image from "next/image";
import { Briefcase, Code, Github, Mail, Music, Network, Rocket, Server, Sparkles } from "lucide-react";

const contacts = [
  { name: "Email", value: "nianshu2022@sina.cn", link: "mailto:nianshu2022@sina.cn", icon: Mail },
  { name: "GitHub", value: "nianshu2022", link: "https://github.com/nianshu2022", icon: Github },
  { name: "网易云音乐", value: "1646904424", link: "https://music.163.com/#/user?id=1646904424", icon: Music },
];

const timeline = [
  { title: "从网络开始", desc: "计算机网络技术让我先看见了系统背后的连接、规则和秩序。", icon: Network },
  { title: "走向产品运营", desc: "进入运营后，我开始更在意人如何理解产品、使用产品，以及为什么留下或离开。", icon: Briefcase },
  { title: "继续折腾技术", desc: "部署服务、研究开源项目、尝试 AI 工具，是我保持手感和好奇心的方式。", icon: Rocket },
  { title: "把经历写下来", desc: "这个数字花园用来存放经验、复盘和生活记录，也给未来的自己留一条回看的路。", icon: Sparkles },
];

const stack = ["Next.js", "Tailwind CSS", "Cloudflare Pages", "Linux / CentOS", "Docker", "AI Tools"];

export default function AboutPage() {
  return (
    <main className="garden-shell">
      <FloatingNav backUrl="/" />

      <section className="grid gap-6 border-b border-border pb-10 sm:gap-8 sm:pb-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <ScrollReveal className="min-w-0">
          <TiltCard>
            <div className="brand-panel overflow-hidden">
              <div className="relative h-[220px] sm:h-[300px] lg:h-[420px]">
                <Image
                  src="/img/graduation-profile-2024.jpg"
                  alt="念舒的个人照片"
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
              <div className="p-6">
                <p className="garden-kicker">关于念舒</p>
                <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">念舒</h1>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  产品运营，技术实践者，长期写作者。正在把一些散落的经历慢慢整理成自己的系统。
                </p>
              </div>
            </div>
          </TiltCard>
        </ScrollReveal>

        <ScrollReveal delay={0.2} direction="right" className="min-w-0">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-5">
              <h2 className="max-w-3xl text-2xl font-semibold leading-tight tracking-normal sm:text-4xl lg:text-5xl">
                我想做的，是把真实的问题看明白，再把它变成可用的体验。
              </h2>
              <p className="garden-subtitle max-w-2xl">
                我在产品运营与技术实践之间工作，关注用户价值，也关注方案落地成本。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {contacts.map((contact, i) => (
                <ScrollReveal key={contact.name} delay={0.3 + i * 0.1} className="min-w-0">
                  <TiltCard>
                    <a href={contact.link} target="_blank" rel="noopener noreferrer" className="garden-panel block p-4 transition-all hover:border-primary/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                      <contact.icon className="mb-4 h-5 w-5 text-primary" />
                      <p className="text-sm font-semibold">{contact.name}</p>
                      <p className="mt-1 truncate text-sm text-muted-foreground">{contact.value}</p>
                    </a>
                  </TiltCard>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.4} className="min-w-0">
              <TiltCard>
                <GitHubStats />
              </TiltCard>
            </ScrollReveal>
            <ScrollReveal delay={0.5} className="min-w-0">
              <TiltCard>
                <ContributionHeatmap />
              </TiltCard>
            </ScrollReveal>
          </div>
        </ScrollReveal>
      </section>

      <section className="grid gap-6 py-10 sm:gap-8 sm:py-14 lg:grid-cols-[1fr_340px]">
        <ScrollReveal className="min-w-0">
          <div>
            <p className="garden-kicker">成长足迹</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">一路走来的线索</h2>
            <div className="mt-5 relative sm:mt-6">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent hidden sm:block" />
              <div className="grid gap-4 sm:grid-cols-2">
                {timeline.map((item, i) => (
                  <ScrollReveal key={item.title} delay={i * 0.1} className="min-w-0">
                    <TiltCard>
                      <div className="garden-panel p-5 relative">
                        <div className="absolute -left-1 top-6 h-3 w-3 rounded-full border-2 border-primary bg-background hidden sm:block" />
                        <item.icon className="mb-5 h-5 w-5 text-primary" />
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.desc}</p>
                      </div>
                    </TiltCard>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3} className="min-w-0">
          <aside className="brand-panel p-6">
            <div className="mb-5 flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">常用技术栈</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {stack.map((item) => (
                <span key={item} className="rounded-md border border-border bg-background/70 px-3 py-1.5 text-sm text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-6 border-t border-border pt-5 text-sm leading-7 text-muted-foreground">
              <Server className="mb-3 h-5 w-5 text-primary" />
              我希望这里不只是一个展示页，而是一个持续更新的工作台：能帮别人少走一点弯路，也能帮我自己记住来时的路。
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <VisitorCounter />
            </div>
          </aside>
        </ScrollReveal>
      </section>

      <section className="grid gap-4 py-10 sm:grid-cols-2 sm:py-14">
        <ScrollReveal delay={0.4} className="min-w-0">
          <TiltCard>
            <MusicChart />
          </TiltCard>
        </ScrollReveal>
        <ScrollReveal delay={0.5} className="min-w-0">
          <TiltCard>
            <VisitorMap />
          </TiltCard>
        </ScrollReveal>
      </section>
    </main>
  );
}
