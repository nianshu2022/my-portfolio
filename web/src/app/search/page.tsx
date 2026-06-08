import type { Metadata } from "next";
import FloatingNav from "@/components/FloatingNav";
import SearchResults from "@/components/SearchResults";
import { getAllEssaySummaries, getAllPostSummaries } from "@/lib/posts";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "档案检索",
  description: "在念舒档案局中检索技术案卷与成长样本。",
};

export default function SearchPage() {
  const posts = getAllPostSummaries();
  const essays = getAllEssaySummaries();

  return (
    <main className="archive-shell max-w-6xl">
      <FloatingNav backUrl="/" />

      <header className="mb-10 border-y border-foreground/80 py-8">
        <p className="inline-flex items-center gap-2 border border-primary px-2 py-1 font-mono text-sm font-bold text-primary">
          <Search className="h-4 w-4" />
          SEARCH DESK
        </p>
        <h1 className="mt-5 text-[clamp(3rem,8vw,5.8rem)] font-black leading-none tracking-normal text-foreground">
          档案检索台
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
          输入技术栈、问题关键词或成长阶段，快速定位技术案卷和成长样本。
        </p>
      </header>

      <SearchResults posts={posts} essays={essays} />
    </main>
  );
}
