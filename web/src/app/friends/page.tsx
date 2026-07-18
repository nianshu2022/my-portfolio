import { friendLinks } from "@/lib/friends-data";
import FloatingNav from "@/components/FloatingNav";
import ScrollReveal from "@/components/ScrollReveal";
import { Mail, Link2 } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "友链",
  description: "念舒长期阅读、反复访问的网站与博客。",
};

export default function FriendsPage() {
  return (
    <main className="ns-shell">
      <FloatingNav backUrl="/" />

      {/* ── Page Header ── */}
      <header className="mb-10 border-b border-border pb-10">
        <p className="mb-3 text-sm font-semibold text-primary">外部链接</p>
        <h1 className="text-5xl font-black leading-tight tracking-tight text-foreground sm:text-6xl">
          <span className="gradient-text">友链</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          长期阅读、反复访问、值得收藏的网站与博客。它们是我学习和观察互联网的外部参照。
        </p>
      </header>

      {/* ── Friend List ── */}
      <div className="space-y-3">
        {friendLinks.map((friend, i) => (
          <ScrollReveal key={friend.name} delay={i * 0.05}>
            <a
              href={friend.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              {/* Avatar */}
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-border">
                <Image
                  src={friend.avatar}
                  alt={friend.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground transition-colors group-hover:text-primary">
                    {friend.name}
                  </span>
                  <Link2 className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                </div>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {friend.description}
                </p>
              </div>

              {/* Tags */}
              {friend.tags && friend.tags.length > 0 && (
                <div className="hidden flex-shrink-0 flex-wrap gap-1.5 sm:flex">
                  {friend.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </a>
          </ScrollReveal>
        ))}

        {/* Apply Friend Link */}
        <ScrollReveal delay={friendLinks.length * 0.05}>
          <a
            href="mailto:nianshu2022@sina.cn?subject=申请友链"
            className="group flex items-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50"
          >
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-primary/50 bg-primary/5">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                申请友链
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                把你的网站发给我，我们互相留一条长期可达的路径。
              </p>
            </div>
          </a>
        </ScrollReveal>
      </div>
    </main>
  );
}
