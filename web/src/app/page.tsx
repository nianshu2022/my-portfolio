import fs from "fs";
import path from "path";
import { ArrowRight, Github, Mail, Rss, MapPin, Sparkles, Code2, Bot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import VisitorCounter from "@/components/VisitorCounter";
import { getAllEssaySummaries, getAllPostSummaries } from "@/lib/posts";
import SplitText from "@/components/ui/SplitText";
import BlurText from "@/components/ui/BlurText";
import CountUp from "@/components/ui/CountUp";
import DynamicGreeting from "@/components/DynamicGreeting";

type PortalService = {
  name: string;
  visibility: string;
  check?: {
    status?: string;
  };
};

function getPublicServices(): PortalService[] {
  try {
    const statusPath = path.join(process.cwd(), "public", "portal-status.json");
    const raw = fs.readFileSync(statusPath, "utf8");
    const data = JSON.parse(raw);
    return data.services?.filter((service: PortalService) => service.visibility === "public") ?? [];
  } catch {
    return [];
  }
}

const skills = [
  "Next.js", "React", "TypeScript", "TailwindCSS",
  "Docker", "Cloudflare", "Linux", "AI / LLM",
  "Node.js", "产品设计", "独立开发",
];

export default function Home() {
  const posts = getAllPostSummaries();
  const essays = getAllEssaySummaries();
  const publicServices = getPublicServices();
  const latestPosts = posts.slice(0, 6);
  const growthSamples = essays.slice(0, 4);
  const activeServices = publicServices.filter((service) =>
    ["online", "protected"].includes(service.check?.status || "")
  );

  return (
    <main className="ns-shell">
      {/* ===== HERO ===== */}
      <section className="hero-section" id="hero">
        <ScrollReveal>
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              00后 · 技术 · 成长 · 创造
            </div>

            <h1 className="hero-title">
              <DynamicGreeting />，我是
              <br />
              <SplitText
                text="念舒"
                itemClassName="gradient-text"
                delay={0.1}
                stagger={0.08}
              />
            </h1>

            <p className="hero-subtitle">
              <BlurText
                text="前端开发者 · 独立折腾者 · 产品实践者"
                delay={0.3}
                stagger={0.05}
              />
              <br />
              <BlurText
                text="用代码记录学习，用文字记录成长。"
                delay={0.55}
                stagger={0.05}
              />
            </p>

            <div className="hero-actions">
              <Link href="/blog" className="btn-primary" id="hero-blog-btn">
                查看博客
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/about" className="btn-secondary" id="hero-about-btn">
                认识我
              </Link>
            </div>

            <div className="hero-stats" aria-label="站点统计">
              <div>
                <strong><CountUp to={posts.length} duration={1.2} /></strong>
                <span>篇文章</span>
              </div>
              <div>
                <strong><CountUp to={essays.length} duration={1.4} /></strong>
                <span>篇随笔</span>
              </div>
              <div>
                <strong><CountUp to={activeServices.length} duration={1.0} /></strong>
                <span>项服务</span>
              </div>
              <div>
                <strong>兰州</strong>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" aria-hidden="true" />坐标</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} direction="right">
          <div className="hero-visual">
            <div className="avatar-wrapper">
              <div className="avatar-ring" aria-hidden="true">
                <div className="avatar-ring-inner">
                  <Image
                    src="/img/avatar.png"
                    alt="念舒"
                    width={288}
                    height={288}
                    className="h-full w-full object-cover"
                    priority
                    unoptimized
                  />
                </div>
              </div>
              <span className="float-tag float-tag-1" aria-hidden="true">
                <Code2 className="h-3 w-3" />前端开发
              </span>
              <span className="float-tag float-tag-2" aria-hidden="true">
                <Bot className="h-3 w-3" />AI 应用
              </span>
              <span className="float-tag float-tag-3" aria-hidden="true">
                <MapPin className="h-3 w-3" />兰州
              </span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ===== RECENT POSTS ===== */}
      <section className="posts-section" id="posts">
        <div className="section-header">
          <h2 className="section-title">最近在写</h2>
          <Link href="/blog" className="section-link" id="posts-all-link">
            查看全部
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="posts-grid">
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="post-card"
            >
              {post.tags && post.tags.length > 0 && (
                <div className="post-card-tags">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>
              )}
              <h3 className="post-card-title">{post.title}</h3>
              <div className="post-card-footer">
                <time className="post-card-date" dateTime={post.date}>{post.date}</time>
                <div className="post-card-arrow" aria-hidden="true">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== ABOUT / SKILLS ===== */}
      <section className="about-section" id="about">
        <ScrollReveal>
          <div className="about-photo">
            <Image
              src="/img/graduation-profile-2024.jpg"
              alt="念舒的个人照片"
              width={600}
              height={800}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="about-copy">
            <h2 className="about-heading">
              折腾者 · 记录者
              <br />
              <span className="gradient-text">创造者</span>
            </h2>
            <p className="about-body">
              一个 00 后，在技术和产品的交界处折腾。喜欢把复杂的事情搞懂，
              然后用简单的方式写出来。在这里记录真实的学习历程——
              包括踩坑、突破和那些让我兴奋的发现。
            </p>
            <div className="skills-wrap" aria-label="技术栈">
              {skills.map((skill) => (
                <span key={skill} className="skill-pill">{skill}</span>
              ))}
            </div>
            <div className="hero-actions">
              <Link href="/about" className="btn-secondary" id="about-more-link">
                了解更多
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ===== ESSAYS ===== */}
      {growthSamples.length > 0 && (
        <section className="essays-section" id="essays">
          <div className="section-header">
            <h2 className="section-title">近期随笔</h2>
            <Link href="/essays" className="section-link" id="essays-all-link">
              查看全部
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="essay-list">
            {growthSamples.map((essay, index) => (
              <Link
                key={essay.slug}
                href={`/essays/${essay.slug}`}
                className="essay-item"
              >
                <div className="essay-item-left">
                  <span className="essay-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="essay-title">{essay.title}</span>
                </div>
                <time className="essay-date" dateTime={essay.date}>{essay.date}</time>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== CONTACT ===== */}
      <section className="contact-section" id="contact">
        <div className="contact-inner">
          <h2 className="contact-label">一起聊聊？</h2>
          <p className="contact-sub">技术交流 · 合作咨询 · 随便聊聊，欢迎找我</p>
          <div className="contact-links">
            <a
              href="https://github.com/nianshu2022"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
              id="contact-github"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>
            <a
              href="mailto:nianshu2022@sina.cn"
              className="contact-link"
              id="contact-email"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Email
            </a>
            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
              id="contact-rss"
            >
              <Rss className="h-4 w-4" aria-hidden="true" />
              RSS
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="ns-footer">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span>© {new Date().getFullYear()} 念舒</span>
          <Link href="/privacy">隐私政策</Link>
          <VisitorCounter />
        </div>
        <p className="mt-2 text-xs opacity-60">
          {posts.length} 篇博客 · {essays.length} 篇随笔 · {activeServices.length} 项服务运行中
        </p>
      </footer>
    </main>
  );
}
