import type { Metadata } from "next";
import FloatingNav from "@/components/FloatingNav";
import SearchResults from "@/components/SearchResults";
import { getAllEssaySummaries, getAllPostSummaries } from "@/lib/posts";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "搜索",
  description: "在技术博客与生活随笔中搜索你关心的内容。",
};

export default function SearchPage() {
  const posts = getAllPostSummaries();
  const essays = getAllEssaySummaries();

  return (
    <main className="garden-shell">
      <FloatingNav backUrl="/" />

      <header className="mb-10 border-b border-border pb-8">
        <p className="garden-kicker inline-flex items-center gap-2">
          <Search className="h-4 w-4" /> 站内搜索
        </p>
        <h1 className="garden-title mt-3">搜索内容</h1>
        <p className="garden-subtitle mt-3 max-w-2xl">在技术博客与生活随笔中，快速找到可复用经验与关键记录。</p>
      </header>

      <SearchResults posts={posts} essays={essays} />
    </main>
  );
}
