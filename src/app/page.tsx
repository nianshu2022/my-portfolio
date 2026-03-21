import { Button } from "@/components/ui/button";
import { BookOpen, Feather, Server, User, Rss, ArrowRight, Calendar, Sparkles, Cpu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DynamicGreeting from "@/components/DynamicGreeting";
import { getAllPostSummaries, getAllEssaySummaries } from "@/lib/posts";

export default function Home() {
  // Fetch latest posts and essays
  const posts = getAllPostSummaries();
  const essays = getAllEssaySummaries();

  // Combine and sort by date (newest first)
  const allUpdates = [...posts.map(p => ({ ...p, type: 'post' })), ...essays.map(e => ({ ...e, type: 'essay' }))]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3); // 最新 3 条

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 sm:p-24 relative overflow-x-hidden">

      {/* Background Blobs (Same as About Page) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-teal-200/30 dark:bg-teal-900/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 animate-fade-in-up">
        <div className="max-w-4xl w-full flex flex-col items-center gap-6 font-sans text-sm">

          {/* Hero Section */}
          <div className="text-center space-y-8 py-8 px-4 sm:p-8 relative">

            {/* Avatar with Ring Animation */}
            <div className="relative inline-block group cursor-pointer mb-10">
              {/* Outer Spinning Ring */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-teal-500 via-purple-500 to-indigo-500 rounded-full opacity-70 blur-md animate-spin-slow group-hover:opacity-100 transition duration-500"></div>

              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white dark:bg-zinc-900 p-1.5 shadow-2xl overflow-hidden transition-transform duration-500 ease-in-out group-hover:scale-105">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <Image
                    src="/img/avatar.png"
                    alt="念舒 Avatar"
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100 drop-shadow-sm px-2 font-serif flex flex-wrap justify-center items-center gap-2 sm:gap-4">
                <DynamicGreeting />
                <span>，我是</span>
                <span className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 bg-clip-text text-transparent whitespace-nowrap animate-gradient-x">念舒。</span>
              </h1>

              <p className="mx-auto max-w-2xl text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium px-4 font-serif">
                <span className="inline-flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-base sm:text-lg">
                  <Sparkles className="w-4 h-4 text-yellow-500" /> 产品运营
                </span>
                <span className="mx-2 opacity-50">/</span>
                00后
                <span className="mx-2 opacity-50">/</span>
                技术折腾家
                <br />
                <span className="text-base sm:text-lg mt-4 block opacity-90">
                  致力于构建连接 <span className="text-teal-600 dark:text-teal-400 font-semibold border-b-2 border-teal-500/20">用户价值</span> 与 <span className="text-purple-600 dark:text-purple-400 font-semibold border-b-2 border-purple-500/20">技术实现</span> 的桥梁
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons - Premium Glass Style */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-4 w-full px-4">
            <Link href="/blog" className="w-full sm:w-auto hover:w-full sm:hover:w-auto transition-all is-button">
              <Button size="lg" className="w-full h-14 px-4 sm:px-8 min-w-0 sm:min-w-[160px] gap-2 sm:gap-3 text-sm sm:text-base font-semibold shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-blue-500/40 rounded-2xl">
                <BookOpen className="h-5 w-5 shrink-0" />
                <span>技术博客</span>
              </Button>
            </Link>

            <Link href="/essays" className="w-full sm:w-auto hover:w-full sm:hover:w-auto transition-all is-button">
              <Button size="lg" variant="secondary" className="w-full h-14 px-4 sm:px-8 min-w-0 sm:min-w-[160px] gap-2 sm:gap-3 text-sm sm:text-base font-medium shadow-md bg-white/60 dark:bg-zinc-800/60 backdrop-blur-xl border border-white/20 dark:border-zinc-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl rounded-2xl text-zinc-700 dark:text-zinc-200">
                <Feather className="h-5 w-5 shrink-0 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                <span>生活随笔</span>
              </Button>
            </Link>

            <Link href="/portal" className="w-full sm:w-auto hover:w-full sm:hover:w-auto transition-all is-button">
              <Button size="lg" variant="secondary" className="w-full h-14 px-4 sm:px-8 min-w-0 sm:min-w-[160px] gap-2 sm:gap-3 text-sm sm:text-base font-medium shadow-md bg-white/60 dark:bg-zinc-800/60 backdrop-blur-xl border border-white/20 dark:border-zinc-700/50 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl rounded-2xl text-zinc-700 dark:text-zinc-200">
                <Server className="h-5 w-5 shrink-0 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
                <span>我的传送门</span>
              </Button>
            </Link>

            <Link href="/gear" className="w-full sm:w-auto hover:w-full sm:hover:w-auto transition-all is-button">
              <Button size="lg" variant="secondary" className="w-full h-14 px-4 sm:px-8 min-w-0 sm:min-w-[160px] gap-2 sm:gap-3 text-sm sm:text-base font-medium shadow-md bg-white/60 dark:bg-zinc-800/60 backdrop-blur-xl border border-white/20 dark:border-zinc-700/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl rounded-2xl text-zinc-700 dark:text-zinc-200">
                <Cpu className="h-5 w-5 shrink-0 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                <span>数字装备</span>
              </Button>
            </Link>

            <Link href="/about" className="w-full sm:w-auto hover:w-full sm:hover:w-auto transition-all is-button">
              <Button size="lg" variant="secondary" className="w-full h-14 px-4 sm:px-8 min-w-0 sm:min-w-[160px] gap-2 sm:gap-3 text-sm sm:text-base font-medium shadow-md bg-white/60 dark:bg-zinc-800/60 backdrop-blur-xl border border-white/20 dark:border-zinc-700/50 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl rounded-2xl text-zinc-700 dark:text-zinc-200">
                <User className="h-5 w-5 shrink-0 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                <span>关于我</span>
              </Button>
            </Link>
          </div>

          {/* Latest Updates Section */}
          <div className="w-full max-w-2xl mt-10 px-4 sm:px-0 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                最新动态
              </h2>
              <Link href="/blog" className="text-xs text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                查看更多 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {allUpdates.map((item) => (
                <Link href={item.type === 'post' ? `/blog/${item.slug}` : `/essays/${item.slug}`} key={item.slug}>
                  <div className="group relative p-5 bg-white/40 dark:bg-zinc-900/40 hover:bg-white/70 dark:hover:bg-zinc-800/60 rounded-2xl border border-white/50 dark:border-zinc-700/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer backdrop-blur-sm">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${item.type === 'post'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                            }`}>
                            {item.type === 'post' ? '技术' : '随笔'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="self-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <ArrowRight className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 mt-8 flex flex-col items-center justify-center gap-3 z-10 text-center px-4 font-sans backdrop-blur-sm">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">© {new Date().getFullYear()} 念舒. All Rights Reserved.</span>
        <div className="text-xs text-zinc-400 dark:text-zinc-600 flex items-center gap-1.5">
          <span>Powered by</span>
          <a href="https://nextjs.org" target="_blank" rel="noreferrer" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Next.js</a>
          <span className="mx-1">•</span>
          <a href="/feed.xml" target="_blank" rel="noreferrer" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors flex items-center gap-1" title="RSS 订阅">
            <Rss className="w-3 h-3" />
            <span>RSS</span>
          </a>
        </div>
      </footer>
    </main>
  );
}
