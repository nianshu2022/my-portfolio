import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getAllPosts } from "@/lib/posts";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative">
      
      <div className="max-w-4xl w-full space-y-8 backdrop-blur-xl bg-white/30 dark:bg-zinc-900/30 p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl relative">
        
         {/* Back Button inside card */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
             <Link href="/">
                <Button 
                    variant="secondary" 
                    size="icon" 
                    className="rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-white hover:dark:bg-zinc-700 hover:scale-110 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 group"
                >
                    <ArrowLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </Button>
            </Link>
        </div>

        <div className="space-y-2 text-center sm:text-left pt-8 sm:pt-4 sm:pl-20">
             <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-flex items-center gap-3 font-serif">
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                技术博客
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-serif">
                分享产品思考与技术折腾笔记。
            </p>
        </div>
        
        <div className="grid gap-4 py-4">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div className="p-6 bg-white/60 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm hover:shadow-lg transition-all cursor-pointer group hover:-translate-x-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                         <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 group-hover:text-blue-600 transition-colors font-serif">
                             {post.title}
                        </h2>
                        <span className="text-xs font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded self-start sm:self-auto shrink-0">
                            {post.date}
                        </span>
                    </div>
                   
                    <p className="text-zinc-600 dark:text-zinc-400 mb-4 text-sm line-clamp-2">
                        {post.description}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex gap-2 flex-wrap">
                            {post.tags?.map(tag => (
                                <span key={tag} className="text-xs px-2.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-full font-medium border border-blue-100 dark:border-blue-800/30">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 ml-2">
                            阅读全文 &rarr;
                        </span>
                    </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
}
