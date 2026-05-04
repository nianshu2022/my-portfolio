import fs from "fs";
import path from "path";
import { ArrowRight, BookOpen, BriefcaseBusiness, ExternalLink, Feather, Github, HeartHandshake, Mail, Rss, Sparkles, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DynamicGreeting from "@/components/DynamicGreeting";
import TypeWriter from "@/components/TypeWriter";
import GlowBorder from "@/components/GlowBorder";
import ScrollReveal from "@/components/ScrollReveal";
import TiltCard from "@/components/TiltCard";
import LazyLoad from "@/components/LazyLoad";
import VisitorCounter from "@/components/VisitorCounter";
import DailyQuote from "@/components/widgets/DailyQuote";
import DailyPoem from "@/components/widgets/DailyPoem";
import ITHomeList from "@/components/widgets/ITHomeList";
import GitHubTrending from "@/components/widgets/GitHubTrending";
import WeatherCard from "@/components/widgets/WeatherCard";
import { getAllEssaySummaries, getAllPostSummaries } from "@/lib/posts";

function getPublicServiceCount(): number {
  try {
    const statusPath = path.join(process.cwd(), "public", "portal-status.json");
    const raw = fs.readFileSync(statusPath, "utf8");
    const data = JSON.parse(raw);
    return data.services?.filter((s: { visibility: string }) => s.visibility === "public").length ?? 0;
  } catch {
    return 0;
  }
}


export default function Home() {
  const posts = getAllPostSummaries();
  const essays = getAllEssaySummaries();
  const publicServiceCount = getPublicServiceCount();
  const updates = [
    ...posts.map((post) => ({ ...post, type: "post" as const })),
    ...essays.map((essay) => ({ ...essay, type: "essay" as const })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  return (
    <main className="garden-shell snap-y snap-proximity">
      <section className="grid min-h-[calc(100vh-8rem)] snap-start gap-8 pb-16 pt-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="space-y-8">
          <ScrollReveal>
            <GlowBorder className="inline-block">
              <div className="inline-flex items-center gap-3 rounded-md border border-border bg-card/80 px-3 py-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span><DynamicGreeting />，欢迎来到念舒的数字花园</span>
              </div>
            </GlowBorder>
          </ScrollReveal>

          <div className="space-y-6">
            <TypeWriter
              text="在产品和技术之间，认真记录每一次抵达。"
              className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-normal text-foreground sm:text-5xl lg:text-7xl"
            />
            <ScrollReveal delay={1.2}>
              <p className="garden-subtitle max-w-2xl">
                技术实践、产品思考与生活记录，每篇解决一个真实问题。
              </p>
            </ScrollReveal>
            <ScrollReveal delay={1.8}>
              <DailyQuote />
            </ScrollReveal>
            <ScrollReveal delay={2.0}>
              <DailyPoem />
            </ScrollReveal>
          </div>

          <ScrollReveal delay={1.5}>
            <div className="flex flex-wrap gap-3">
              <GlowBorder className="inline-block">
                <Link href="/blog" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90">
                  <BookOpen className="h-4 w-4" />
                  阅读技术博客
                </Link>
              </GlowBorder>
              <GlowBorder className="inline-block">
                <Link href="/essays" className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
                  <Feather className="h-4 w-4" />
                  翻生活随笔
                </Link>
              </GlowBorder>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.3} direction="right">
          <TiltCard>
            <aside className="brand-panel overflow-hidden">
              <div className="grid gap-0 sm:grid-cols-[0.92fr_1.08fr] lg:grid-cols-1">
                <div className="relative min-h-[260px]">
                  <Image
                    src="/img/graduation-profile-2024.jpg"
                    alt="念舒的个人照片"
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>
                <div className="space-y-6 p-6">
                  <div>
                    <p className="garden-kicker">念舒 / 产品运营</p>
                    <h2 className="mt-3 text-3xl font-semibold">关心体验，也关心落地。</h2>
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">
                    从用户场景出发，追到系统实现细节。这里记录这些视角互相补充的过程。
                  </p>
                  <div className="grid grid-cols-3 gap-3 border-t border-border pt-5 text-center">
                    <div>
                      <div className="text-2xl font-semibold">{posts.length}</div>
                      <div className="mt-1 text-xs text-muted-foreground">技术文章</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold">{essays.length}</div>
                      <div className="mt-1 text-xs text-muted-foreground">生活随笔</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold">{publicServiceCount}</div>
                      <div className="mt-1 text-xs text-muted-foreground">在线服务</div>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <WeatherCard />
                  </div>
                </div>
              </div>
            </aside>
          </TiltCard>
        </ScrollReveal>
      </section>

      <section className="grid min-h-[50vh] snap-start items-center gap-8 border-t border-border py-14 lg:grid-cols-[1.1fr_0.9fr]">
        <ScrollReveal>
          <div>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="garden-kicker">最新动态</p>
                <h2 className="mt-3 text-3xl font-semibold">最近更新</h2>
              </div>
              <Link href="/archive" className="garden-link shrink-0">
                全部归档 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-border brand-panel px-5">
              {updates.map((item, i) => (
                <ScrollReveal key={`${item.type}-${item.slug}`} delay={i * 0.08}>
                  <Link
                    href={item.type === "post" ? `/blog/${item.slug}` : `/essays/${item.slug}`}
                    className="group grid gap-2 py-5"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-md bg-secondary px-2 py-1">{item.type === "post" ? "技术博客" : "生活随笔"}</span>
                      <span>{item.date}</span>
                    </div>
                    <h3 className="line-clamp-1 text-lg font-semibold transition-colors group-hover:text-primary">{item.title}</h3>
                    <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <TiltCard>
            <div className="brand-panel flex flex-col justify-between p-6">
              <div>
                <BriefcaseBusiness className="mb-6 h-6 w-6 text-primary" />
                <p className="garden-kicker">我在意的事</p>
                <h2 className="mt-3 text-3xl font-semibold">把想法落到真实可用的地方。</h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  产品思维让我先问&ldquo;对谁有用&rdquo;，技术实践让我追问&ldquo;怎么跑起来&rdquo;。写作把这些过程留下来。
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/about" className="garden-link">
                  <UserRound className="h-4 w-4" />
                  关于我
                </Link>
                <Link href="/friends" className="garden-link">
                  <HeartHandshake className="h-4 w-4" />
                  友链
                </Link>
                <a href="/feed.xml" target="_blank" rel="noreferrer" className="garden-link">
                  <Rss className="h-4 w-4" />
                  RSS
                </a>
              </div>
            </div>
          </TiltCard>
        </ScrollReveal>
      </section>

      <LazyLoad>
        <section className="grid min-h-[50vh] snap-start items-start gap-8 border-t border-border py-14 lg:grid-cols-[1.1fr_0.9fr]">
          <ScrollReveal>
            <div>
              <p className="garden-kicker">开源风向</p>
              <h2 className="mt-3 text-3xl font-semibold">GitHub 热门</h2>
              <div className="mt-6">
                <TiltCard>
                  <GitHubTrending />
                </TiltCard>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} direction="right">
            <div>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="garden-kicker">技术脉搏</p>
                  <h2 className="mt-3 text-3xl font-semibold">技术脉搏</h2>
                </div>
                <a
                  href="https://www.ithome.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="garden-link shrink-0"
                >
                  IT之家 <ExternalLink className="inline h-4 w-4" />
                </a>
              </div>
              <TiltCard>
                <ITHomeList />
              </TiltCard>
            </div>
          </ScrollReveal>
        </section>
      </LazyLoad>

      <footer className="border-t border-border pt-8 pb-6 text-sm text-muted-foreground">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} 念舒. All Rights Reserved.</span>
          <div className="flex items-center gap-4">
            <a href="https://github.com/nianshu2022" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </a>
            <a href="mailto:nianshu2022@sina.cn" className="transition-colors hover:text-foreground" aria-label="Email">
              <Mail className="h-4 w-4" />
            </a>
            <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground" aria-label="RSS">
              <Rss className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <VisitorCounter />
          <span className="text-xs opacity-60">用 Next.js 搭建，也用来保存长期记忆。</span>
        </div>
      </footer>
    </main>
  );
}
