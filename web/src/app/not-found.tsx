import Link from "next/link";
import { FileQuestion, Home, Search, Archive } from "lucide-react";
import { getAllPostSummaries, getAllEssaySummaries } from "@/lib/posts";

export default function NotFound() {
  const posts = getAllPostSummaries();
  const essays = getAllEssaySummaries();
  const allItems = [...posts, ...essays];
  // Pick a random article for recommendation variety
  const recommendedItem = allItems.length > 0
    ? allItems[Math.floor(Math.random() * allItems.length)]
    : null;
  const recommendedHref = recommendedItem
    ? posts.includes(recommendedItem)
      ? `/blog/${recommendedItem.slug}`
      : `/essays/${recommendedItem.slug}`
    : null;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-lg text-center">
        {/* Big 404 */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10">
            <FileQuestion className="h-12 w-12 text-primary" />
          </div>
        </div>

        <p className="mb-2 text-sm font-semibold text-primary">404</p>
        <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          页面不存在
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          这个地址没有对应的内容。可能是链接失效，或者这篇内容还没有发布。
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="btn-primary"
          >
            <Home className="h-4 w-4" />
            回到首页
          </Link>
          <Link
            href="/search"
            className="btn-secondary"
          >
            <Search className="h-4 w-4" />
            全站搜索
          </Link>
          <Link
            href="/archive"
            className="btn-secondary"
          >
            <Archive className="h-4 w-4" />
            查看归档
          </Link>
        </div>

        {/* Recommended latest post */}
        {recommendedItem && recommendedHref && (
          <p className="mt-8 text-sm text-muted-foreground">
            试试最新的一篇：
            <Link
              href={recommendedHref}
              className="ml-1.5 font-semibold text-primary hover:text-accent-foreground"
            >
              {recommendedItem.title}
            </Link>
          </p>
        )}
      </section>
    </main>
  );
}
