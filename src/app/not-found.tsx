import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4">
      <div className="text-center space-y-4">
        <h1 className="text-9xl font-bold text-blue-500/20 select-none">404</h1>
        <h2 className="text-2xl font-bold">页面未找到</h2>
        <p className="text-zinc-500 max-w-md mx-auto">
          抱歉，您访问的页面似乎已经迷路了。它可能已被移动、删除或从未存在过。
        </p>
      </div>
      <Button asChild className="rounded-full px-8">
        <Link href="/">
          返回首页
        </Link>
      </Button>
    </div>
  );
}

