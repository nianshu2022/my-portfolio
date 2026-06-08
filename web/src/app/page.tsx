import fs from "fs";
import path from "path";
import { ArrowRight, Github, Mail, Rss } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import VisitorCounter from "@/components/VisitorCounter";
import { getAllEssaySummaries, getAllPostSummaries } from "@/lib/posts";
import type { PostSummary } from "@/lib/posts";
import type { CSSProperties } from "react";

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

function countByTags(posts: PostSummary[], tags: string[]) {
  return posts.filter((post) => post.tags?.some((tag) => tags.includes(tag))).length;
}

function buildCaseNumbers(posts: PostSummary[]) {
  const byYear = new Map<string, PostSummary[]>();

  posts.forEach((post) => {
    const year = post.date.slice(0, 4) || "0000";
    byYear.set(year, [...(byYear.get(year) || []), post]);
  });

  const numbers = new Map<string, { short: string; full: string }>();
  byYear.forEach((yearPosts, year) => {
    yearPosts
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.slug.localeCompare(b.slug);
      })
      .forEach((post, index) => {
        const short = String(index + 1).padStart(3, "0");
        numbers.set(post.slug, {
          short,
          full: `NS-${year}-${short}`,
        });
      });
  });

  return numbers;
}

export default function Home() {
  const posts = getAllPostSummaries();
  const essays = getAllEssaySummaries();
  const publicServices = getPublicServices();
  const caseNumbers = buildCaseNumbers(posts);
  const latestCases = posts.slice(0, 5);
  const growthSamples = essays.slice(0, 3);
  const latestYear = [...posts, ...essays]
    .map((item) => item.date.slice(0, 4))
    .filter(Boolean)
    .sort()
    .at(-1);

  const indexGroups = [
    {
      name: "前端开发",
      count: countByTags(posts, ["Next.js", "React", "TailwindCSS", "Vue3", "前端开发"]),
      note: "升级、组件、页面体验",
    },
    {
      name: "后端与运维",
      count: countByTags(posts, ["Cloudflare", "Docker", "Linux", "Serverless", "运维", "部署"]),
      note: "部署、隧道、故障排查",
    },
    {
      name: "AI 与本地模型",
      count: countByTags(posts, ["AI", "DeepSeek", "Ollama", "Gemma", "大模型"]),
      note: "本地化、工具链、实践记录",
    },
    {
      name: "生活与成长",
      count: essays.length,
      note: "比赛、毕业、阶段复盘",
    },
  ];

  const activeServices = publicServices.filter((service) =>
    ["online", "protected"].includes(service.check?.status || "")
  );
  const organizing = [
    { name: "AI 学习与应用笔记", status: "补全中", progress: 63 },
    { name: "独立开发的方法论", status: "复盘中", progress: 41 },
    { name: "大学生活与成长复盘", status: "持续写", progress: 27 },
  ];

  return (
    <main className="archive-shell">
      <section className="archive-hero">
        <div className="archive-ruler" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={index}>{String(index + 1).padStart(2, "0")}</span>
          ))}
        </div>
        <div className="archive-coordinate" aria-hidden="true">
          <span>A</span>
          <span>B</span>
          <span>C</span>
          <span>D</span>
          <span>E</span>
          <span>F</span>
        </div>

        <ScrollReveal>
          <div className="archive-hero-copy">
            <div className="archive-serial">
              <span>公共档案 001 号</span>
              <span>公开</span>
            </div>
            <h1>念舒档案局</h1>
            <p className="archive-lede">一个 00 后技术折腾者的成长样本库。</p>

            <dl className="archive-id-card">
              <div>
                <dt>档案主理人</dt>
                <dd>念舒</dd>
              </div>
              <div>
                <dt>编号</dt>
                <dd>NIANSHU-2001</dd>
              </div>
              <div>
                <dt>身份</dt>
                <dd>00 后技术折腾者 / 产品实践者</dd>
              </div>
              <div>
                <dt>坐标</dt>
                <dd>中国 / 兰州</dd>
              </div>
              <div>
                <dt>记录范围</dt>
                <dd>技术案卷、成长样本、在线服务</dd>
              </div>
              <div>
                <dt>当前状态</dt>
                <dd>
                  持续记录中
                  <span className="archive-live-dot" aria-hidden="true" />
                </dd>
              </div>
            </dl>
            <Image
              src="/img/archive-seal.png"
              alt=""
              width={512}
              height={512}
              className="archive-seal"
              aria-hidden="true"
              unoptimized
            />

            <div className="archive-actions">
              <Link href="/blog" className="archive-button archive-button-primary">
                查看技术案卷
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/about" className="archive-button archive-button-secondary">
                认识念舒
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="archive-footnote">
              所有记录基于真实经历，持续归档，长期开放。
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15} direction="right">
          <aside className="archive-board" aria-label="最近技术案卷">
            <div className="archive-board-header">
              <h2>最近案卷</h2>
              <Link href="/blog">
                查看全部
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="archive-case-list">
              {latestCases.map((post) => {
                const caseNumber = caseNumbers.get(post.slug) || { short: "000", full: "NS-0000-000" };

                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="archive-case-row">
                    <span className="archive-case-index">{caseNumber.short}</span>
                    <span className="archive-case-stamp">案卷</span>
                    <span className="archive-case-main">
                      <strong>{post.title}</strong>
                      <small>{post.tags?.slice(0, 3).join(" · ") || "未分类"}</small>
                    </span>
                    <span className="archive-case-date">{post.date}</span>
                    <span className="archive-case-no">{caseNumber.full}</span>
                  </Link>
                );
              })}
            </div>

            <div className="archive-board-grid">
              <div>
                <h3>正在整理</h3>
                <ul className="archive-progress-list">
                  {organizing.map((item) => (
                    <li key={item.name}>
                      <span>{item.name}</span>
                      <em>{item.progress}%</em>
                      <b style={{ "--progress": `${item.progress}%` } as CSSProperties} />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>公开服务</h3>
                <ul className="archive-service-list">
                  {(publicServices.length ? publicServices : [{ name: "在线服务", visibility: "public", check: { status: "" } }]).map((service) => (
                    <li key={service.name}>
                      <span>{service.name}</span>
                      <em>
                        {["online", "protected"].includes(service.check?.status || "") ? "运行中" : "待检查"}
                        <span className="archive-live-dot" aria-hidden="true" />
                      </em>
                    </li>
                  ))}
                </ul>
                <Link href="/portal" className="archive-inline-link">
                  查看服务清单
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="archive-barcode" aria-hidden="true">
              <span>ARCHIVE BUREAU</span>
              <span>NIANSHU ARCHIVES</span>
            </div>
          </aside>
        </ScrollReveal>
      </section>

      <section className="archive-index-section">
        <div className="archive-section-heading">
          <span>01</span>
          <div>
            <h2>案卷索引</h2>
            <p>按主题、技术栈与时间，快速定位你感兴趣的内容。</p>
          </div>
          <Link href="/archive">
            进入时间索引
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="archive-timeline-ruler" aria-hidden="true">
          <span>2021</span>
          <span>2022</span>
          <span>2023</span>
          <span>2024</span>
          <span>{latestYear || "2025"}</span>
        </div>

        <div className="archive-index-grid">
          {indexGroups.map((group) => (
            <Link key={group.name} href={group.name === "生活与成长" ? "/essays" : "/blog"} className="archive-index-card">
              <span>{group.name}</span>
              <strong>{group.count} 份</strong>
              <small>{group.note}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="archive-growth-section">
        <div className="archive-growth-media">
          <Image
            src="/img/graduation-profile-2024.jpg"
            alt="念舒的个人照片"
            width={900}
            height={680}
            className="h-full w-full object-cover"
            priority
            unoptimized
          />
        </div>
        <div className="archive-growth-copy">
          <div className="archive-section-heading archive-section-heading-compact">
            <span>02</span>
            <div>
              <h2>成长样本</h2>
              <p>把阶段经历留下来，让技术之外的选择也能被看见。</p>
            </div>
          </div>

          <div className="archive-sample-list">
            {growthSamples.map((essay, index) => (
              <Link key={essay.slug} href={`/essays/${essay.slug}`} className="archive-sample-row">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{essay.title}</strong>
                <small>{essay.date}</small>
              </Link>
            ))}
          </div>

          <div className="archive-contact-strip">
            <Link href="https://github.com/nianshu2022" target="_blank" rel="noopener noreferrer">
              GitHub
              <Github className="h-4 w-4" />
            </Link>
            <a href="mailto:nianshu2022@sina.cn">
              Email
              <Mail className="h-4 w-4" />
            </a>
            <a href="/feed.xml" target="_blank" rel="noopener noreferrer">
              RSS
              <Rss className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <footer className="archive-footer">
        <div>
          <span>© {new Date().getFullYear()} 念舒档案局</span>
          <Link href="/privacy">隐私政策</Link>
        </div>
        <div>
          <VisitorCounter />
          <span>{posts.length} 份技术案卷 · {essays.length} 份成长样本 · {activeServices.length} 项公开服务运行中</span>
        </div>
      </footer>
    </main>
  );
}
