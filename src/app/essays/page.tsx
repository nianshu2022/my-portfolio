import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Quote } from "lucide-react";
import { getAllEssays } from "@/lib/posts";

export default function EssaysPage() {
  const posts = getAllEssays();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative">
      
      <div className="max-w-4xl w-full space-y-8 backdrop-blur-xl bg-white/30 dark:bg-zinc-900/30 p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl relative">
        
         {/* Back Button inside card */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
             <Link href="/">
                <Button 
                    variant="secondary" 
                    size="icon" 
                    className="rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-white hover:dark:bg-zinc-700 hover:scale-110 hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 group"
                >
                    <ArrowLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                </Button>
            </Link>
        </div>

        <div className="space-y-2 text-center sm:text-left pt-8 sm:pt-4 sm:pl-20">
             <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent inline-block font-serif">
                生活随笔
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-serif italic">
                "人生逐梦正当时，且行且歌。"
            </p>
        </div>
        
        <div className="grid gap-6 py-4">
            {posts.map((post) => (
              <Link key={post.slug} href={`/essays/${post.slug}`}>
                <div className="p-8 bg-white/50 dark:bg-zinc-800/30 rounded-xl border border-white/40 dark:border-zinc-700/30 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:bg-white/80 dark:hover:bg-zinc-800/50">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                            <h2 className="text-2xl font-serif font-medium text-zinc-800 dark:text-zinc-100 group-hover:text-purple-700 transition-colors">
                                {post.title}
                            </h2>
                            <span className="text-xs font-mono text-zinc-400 pt-0 sm:pt-2">
                                {post.date}
                            </span>
                        </div>
                        
                        <div className="relative pl-6 border-l-2 border-purple-200 dark:border-purple-900/50">
                            <Quote className="absolute -top-1 left-0 -ml-[9px] w-4 h-4 text-purple-300 dark:text-purple-800 fill-purple-100 dark:fill-purple-900/20 bg-white dark:bg-zinc-900" />
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-serif italic line-clamp-3">
                                {post.description}
                            </p>
                        </div>

                        <div className="flex justify-end items-center mt-2">
                            <span className="text-xs text-purple-500 opacity-60 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-serif">
                                阅读全文 &rarr;
                            </span>
                        </div>
                    </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
}

