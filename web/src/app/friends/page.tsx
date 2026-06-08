import { friendLinks } from "@/lib/friends-data";
import FloatingNav from "@/components/FloatingNav";
import ScrollReveal from "@/components/ScrollReveal";
import { Heart, Link2, Mail } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "外部路径",
  description: "念舒档案局收藏和长期访问的外部站点。",
};

export default function FriendsPage() {
  return (
    <main className="archive-shell max-w-6xl">
      <FloatingNav backUrl="/" />

      <header className="mb-10 border-y border-foreground/80 py-8">
        <p className="inline-flex items-center gap-2 border border-primary px-2 py-1 font-mono text-sm font-bold text-primary">
          <Heart className="h-4 w-4" />
          EXTERNAL ROUTES
        </p>
        <h1 className="mt-5 text-[clamp(3rem,8vw,5.8rem)] font-black leading-none tracking-normal text-foreground">
          外部路径
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
          长期阅读、反复访问、值得收藏的网站与博客。它们是我学习和观察互联网的外部参照。
        </p>
      </header>

      <div className="border-y border-foreground/70">
        {friendLinks.map((friend, i) => (
          <ScrollReveal key={friend.name} delay={i * 0.06}>
            <a
              href={friend.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid gap-4 border-b border-border px-4 py-5 transition-colors last:border-b-0 hover:bg-secondary/70 sm:grid-cols-[4rem_4rem_1fr_12rem] sm:items-center"
            >
              <span className="font-mono text-lg font-black text-primary">{String(i + 1).padStart(3, "0")}</span>
              <Image src={friend.avatar} alt={friend.name} width={48} height={48} className="h-12 w-12 border border-border object-cover" unoptimized />
              <span className="min-w-0">
                    <span className="flex items-center gap-2 truncate text-lg font-black transition-colors group-hover:text-primary">
                      {friend.name}
                      <Link2 className="h-4 w-4 shrink-0" />
                    </span>
                    <span className="mt-2 block line-clamp-2 text-sm leading-6 text-muted-foreground">{friend.description}</span>
              </span>
              <span className="flex flex-wrap gap-1 font-mono text-xs text-muted-foreground">
                {friend.tags?.map((tag) => (
                  <span key={tag} className="border border-border bg-card px-1.5 py-0.5">{tag}</span>
                ))}
              </span>
            </a>
          </ScrollReveal>
        ))}

        <ScrollReveal delay={friendLinks.length * 0.06}>
          <a
            href="mailto:nianshu2022@sina.cn?subject=%E7%94%B3%E8%AF%B7%E5%8F%8B%E9%93%BE"
            className="group grid gap-4 px-4 py-5 text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground sm:grid-cols-[4rem_4rem_1fr]"
          >
            <span className="font-mono text-lg font-black text-primary">{String(friendLinks.length + 1).padStart(3, "0")}</span>
            <span className="flex h-12 w-12 items-center justify-center border border-border bg-card">
              <Mail className="h-5 w-5 text-primary" />
            </span>
            <span>
              <span className="block text-lg font-black text-foreground transition-colors group-hover:text-primary">申请友链</span>
              <span className="mt-2 block text-sm leading-6">把你的网站发给我，我们互相留一条长期可达的路径。</span>
            </span>
          </a>
        </ScrollReveal>
      </div>
    </main>
  );
}
