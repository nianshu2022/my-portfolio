import { Button } from "@/components/ui/button";
import { Github, BookOpen, Feather, Server, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 sm:p-24 relative overflow-x-hidden">
      <div className="flex-1 flex flex-col items-center justify-center w-full z-10">
          <div className="max-w-4xl w-full flex flex-col items-center gap-8 font-sans text-sm">
            
            {/* Hero Section */}
            <div className="text-center space-y-8 py-8 px-4 sm:p-8">
              <div className="relative inline-block group cursor-pointer">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-xl overflow-hidden transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-3">
        <Image
                      src="/img/avatar.gif" 
                      alt="念舒 Avatar" 
                      width={128} 
                      height={128} 
                      className="object-cover w-full h-full"
          priority
                      unoptimized
        />
                </div>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight lg:text-6xl text-zinc-800 dark:text-zinc-100 drop-shadow-sm px-2 font-serif">
                  你好，我是 <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent whitespace-nowrap">念舒</span>
          </h1>
                
                <p className="mx-auto max-w-xl text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium px-4 font-serif">
                  <span className="font-bold text-zinc-900 dark:text-zinc-50">产品运营</span> / 00后 / 技术折腾家
                  <br />
                  <span className="text-sm mt-2 block opacity-90">
                    致力于构建连接 <span className="underline decoration-blue-400 decoration-2 underline-offset-2">用户价值</span> 与 <span className="underline decoration-purple-400 decoration-2 underline-offset-2">技术实现</span> 的桥梁
                  </span>
          </p>
        </div>
            </div>

            {/* Action Buttons - Unified Sizing & Style & Animation with Hover Colors */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4 w-full flex-wrap px-4">
              <Link href="/blog" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-6 min-w-[150px] gap-2 shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-violet-600 border-0 text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-blue-500/40">
                  <BookOpen className="h-4 w-4" />
                  技术博客
                </Button>
              </Link>
              
              <Link href="/essays" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto h-12 px-6 min-w-[150px] gap-2 shadow-md bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group border border-transparent hover:border-purple-500/20">
                  <Feather className="h-4 w-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                  生活随笔
                </Button>
              </Link>

               <Link href="/portal" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto h-12 px-6 min-w-[150px] gap-2 shadow-md bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group border border-transparent hover:border-cyan-500/20">
                  <Server className="h-4 w-4 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
                  我的服务
                </Button>
              </Link>
              
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto h-12 px-6 min-w-[150px] gap-2 shadow-md bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group border border-transparent hover:border-teal-500/20">
                  <User className="h-4 w-4 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                  联系我
                </Button>
              </Link>
            </div>

          </div>
      </div>
      
      {/* Footer / ICP Filing Info */}
      <footer className="w-full py-6 mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-500 z-10 text-center px-4">
         <a 
            href="https://beian.miit.gov.cn/" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors justify-center"
        >
             <Image src="/img/miit.ico" alt="ICP" width={18} height={18} className="w-4 h-4 object-contain" unoptimized />
             <span>陇ICP备2023001612号-1</span>
         </a>
         
         <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">|</span>

         <a 
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=62010202004273" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors justify-center"
          >
             <Image src="/img/mps.ico" alt="公安" width={18} height={18} className="w-4 h-4 object-contain" unoptimized />
             <span>甘公网安备62010202004273号</span>
          </a>
      </footer>
      </main>
  );
}
