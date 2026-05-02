import { friendLinks } from "@/lib/friends-data";
import FloatingNav from "@/components/FloatingNav";
import ScrollReveal from "@/components/ScrollReveal";
import TiltCard from "@/components/TiltCard";
import { Heart, Link2, Mail } from "lucide-react";
import Image from "next/image";
import FriendLinkModal from "@/components/FriendLinkModal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "友链",
  description: "分享我喜爱的网站和博客。",
};

export default function FriendsPage() {
  return (
    <main className="garden-shell">
      <FloatingNav backUrl="/" />

      <header className="mb-10 border-b border-border pb-8">
        <p className="garden-kicker inline-flex items-center gap-2"><Heart className="h-4 w-4" /> 友情链接</p>
        <h1 className="garden-title mt-3">我的友链</h1>
        <p className="garden-subtitle mt-3 max-w-2xl">长期阅读、反复访问、值得收藏的网站与博客。欢迎来信交换友链。</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {friendLinks.map((friend, i) => (
          <ScrollReveal key={friend.name} delay={i * 0.06}>
            <TiltCard>
              <a href={friend.url} target="_blank" rel="noopener noreferrer" className="garden-panel group block p-5 min-h-[180px] transition-all hover:border-primary/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                <div className="mb-5 flex items-center gap-4">
                  <Image src={friend.avatar} alt={friend.name} width={48} height={48} className="h-12 w-12 rounded-md border border-border object-cover" unoptimized />
                  <div className="min-w-0">
                    <h2 className="flex items-center gap-2 truncate font-semibold group-hover:text-primary">
                      {friend.name}
                      <Link2 className="h-4 w-4 shrink-0" />
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {friend.tags?.map((tag) => (
                        <span key={tag} className="rounded border border-border bg-background px-1.5 py-0.5 text-xs text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{friend.description}</p>
              </a>
            </TiltCard>
          </ScrollReveal>
        ))}

        <ScrollReveal delay={friendLinks.length * 0.06}>
          <a href="mailto:nianshu2022@sina.cn?subject=%E7%94%B3%E8%AF%B7%E5%8F%8B%E9%93%BE" className="garden-panel flex min-h-44 flex-col justify-between p-5 text-muted-foreground transition-all hover:border-primary/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] hover:text-foreground">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold text-foreground">申请友链</h2>
              <p className="mt-2 text-sm leading-6">把你的网站发给我，我们互相留一条长期可达的路径。</p>
            </div>
          </a>
        </ScrollReveal>
      </div>
    </main>
  );
}
