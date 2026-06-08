import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Archive, FileQuestion, Home, Search } from "lucide-react";
import { getAllPostSummaries, getAllEssaySummaries } from "@/lib/posts";

export default function NotFound() {
  const posts = getAllPostSummaries();
  const essays = getAllEssaySummaries();
  const allItems = [...posts, ...essays];
  const recommendedItem = allItems[0] ?? null;
  const recommendedHref = recommendedItem
    ? posts.includes(recommendedItem)
      ? `/blog/${recommendedItem.slug}`
      : `/essays/${recommendedItem.slug}`
    : null;

  return (
    <main className="archive-shell flex min-h-screen items-center justify-center">
      <section className="relative w-full max-w-3xl border border-foreground/60 bg-card/90 p-6 sm:p-8">
        <div className="flex flex-col gap-8 sm:grid sm:grid-cols-[8rem_1fr] sm:items-start">
          <div className="grid aspect-square place-items-center border border-primary text-primary">
            <FileQuestion className="h-12 w-12" />
          </div>
          <div>
            <p className="font-mono text-sm font-bold text-primary">404 · ARCHIVE MISSING</p>
            <h1 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">档案未收录</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              当前地址没有对应的公开记录。可能是案卷迁移、链接失效，或这份内容还没有进入公开目录。
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 border-y border-border py-5 font-mono text-xs text-muted-foreground sm:grid-cols-3">
          <span>编号：NIANSHU-404</span>
          <span>状态：未归档</span>
          <span>坐标：中国 / 兰州</span>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="rounded-none border border-foreground bg-foreground text-background hover:opacity-90">
            <Link href="/">
              <Home className="h-4 w-4" />
              回到首页
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-none border-foreground">
            <Link href="/search">
              <Search className="h-4 w-4" />
              搜索档案
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-none border-foreground">
            <Link href="/archive">
              <Archive className="h-4 w-4" />
              时间索引
            </Link>
          </Button>
        </div>

        {recommendedItem && recommendedHref && (
          <p className="mt-6 border-l-2 border-primary pl-4 text-sm text-muted-foreground">
            最近归档：
            <Link href={recommendedHref} className="ml-1 font-semibold text-foreground hover:text-primary">
              {recommendedItem.title}
            </Link>
          </p>
        )}
      </section>
    </main>
  );
}
