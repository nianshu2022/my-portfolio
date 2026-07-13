import type { Metadata } from "next";
import FloatingNav from "@/components/FloatingNav";
import SearchResults from "@/components/SearchResults";
import { getAllEssaySummaries, getAllPostSummaries } from "@/lib/posts";

export const metadata: Metadata = {
  title: "搜索",
  description: "在念舒的博客中搜索文章和随笔。",
};

export default function SearchPage() {
  const posts = getAllPostSummaries();
  const essays = getAllEssaySummaries();

  return (
    <main className="ns-shell">
      <FloatingNav backUrl="/" />

      <header className="mb-10 border-b border-border pb-10">
        <p className="mb-3 text-sm font-semibold text-primary">✦ 全站检索</p>
        <h1 className="text-5xl font-black leading-tight tracking-tight text-foreground sm:text-6xl">
          <span className="gradient-text">搜索</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          输入技术栈、问题关键词或成长阶段，快速定位文章和随笔。
        </p>
      </header>

      <SearchResults posts={posts} essays={essays} />
    </main>
  );
}
