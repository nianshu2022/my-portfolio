"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

interface FloatingNavProps {
  backUrl?: string;
}

export default function FloatingNav({ backUrl = "/blog" }: FloatingNavProps) {
  const router = useRouter();

  return (
    <div className="fixed z-50 flex flex-col gap-4 transition-all duration-300 bottom-6 left-6 xl:bottom-auto xl:top-1/2 xl:-translate-y-1/2 xl:left-[calc(50%-44rem)] 2xl:left-[calc(50%-46rem)]">
      <Button
        variant="secondary"
        size="icon"
        className="hidden xl:flex rounded-full w-12 h-12 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-xl shadow-zinc-200/20 dark:shadow-black/40 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 hover:dark:bg-zinc-800 hover:scale-110 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 group"
        title="返回列表"
        onClick={() => router.push(backUrl)}
      >
        <ArrowLeft className="h-8 w-8 group-hover:-translate-x-1 transition-transform duration-300" />
      </Button>

      <Button
        variant="secondary"
        size="icon"
        className="rounded-full w-12 h-12 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-xl shadow-zinc-200/20 dark:shadow-black/40 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 hover:dark:bg-zinc-800 hover:scale-110 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 group"
        title="回到首页"
        onClick={() => router.push("/")}
      >
        <Home className="h-8 w-8" />
      </Button>
    </div>
  );
}

