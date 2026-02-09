import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-[80px] animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-[80px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="text-center space-y-6 z-10 flex flex-col items-center">
        {/* Animated Ghost Icon */}
        <div className="relative">
          <div className="absolute -inset-4 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full blur-xl animate-pulse"></div>
          <Ghost className="w-24 h-24 text-zinc-300 dark:text-zinc-600 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-500 dark:from-zinc-700 dark:to-zinc-500 select-none font-serif">
            404
          </h1>
          <h2 className="text-2xl font-bold text-zinc-700 dark:text-zinc-200">
            哎呀，这里是荒原
          </h2>
          <p className="text-zinc-500 max-w-md mx-auto leading-relaxed">
            看来这个页面已经去流浪了。<br />
            它可能被外星人抓走了，或者从来就没有存在过。
          </p>
        </div>
      </div>

      <Button asChild className="rounded-full px-8 py-6 h-auto text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 z-10 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
        <Link href="/">
          带我回家
        </Link>
      </Button>
    </div>
  );
}

