import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, Home, Search } from "lucide-react";
import { getAllPostSummaries, getAllEssaySummaries } from "@/lib/posts";

export default function NotFound() {
  const posts = getAllPostSummaries();
  const essays = getAllEssaySummaries();
  const allItems = [...posts, ...essays];
  const randomItem = allItems.length > 0
    ? allItems[Math.floor(Math.random() * allItems.length)]
    : null;
  const randomHref = randomItem
    ? posts.includes(randomItem)
      ? `/blog/${randomItem.slug}`
      : `/essays/${randomItem.slug}`
    : null;

  return (
    <main className="garden-shell flex min-h-screen items-center justify-center">
      <section className="garden-panel max-w-xl p-8 text-center">
        <Compass className="mx-auto mb-6 h-10 w-10 text-primary animate-float" />
        <p className="garden-kicker">404</p>
        <h1 className="mt-3 text-3xl font-bold">信号未到达</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          你访问的页面不存在，可能是链接变更、内容迁移，或者这个节点还没有上线。
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="rounded-md bg-primary text-primary-foreground hover:opacity-90">
            <Link href="/">
              <Home className="h-4 w-4" />
              回到首页
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-md">
            <Link href="/search">
              <Search className="h-4 w-4" />
              搜索内容
            </Link>
          </Button>
        </div>
        {randomItem && randomHref && (
          <p className="mt-6 text-sm text-muted-foreground">
            或者看看这篇：
            <Link href={randomHref} className="ml-1 text-primary hover:underline">
              {randomItem.title}
            </Link>
          </p>
        )}
      </section>
    </main>
  );
}
