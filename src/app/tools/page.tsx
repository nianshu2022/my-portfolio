import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Image from "next/image";

const myServices = [
  {
    name: "0lovehub",
    description: "个人主页/导航站",
    url: "https://zc.nianshu2022.cn",
    icon: "https://zc.nianshu2022.cn/favicon.ico"
  },
  {
    name: "With You",
    description: "记录时间的流逝",
    url: "https://time.nianshu2022.cn",
    icon: "https://time.nianshu2022.cn/favicon.ico"
  },
  {
    name: "Uptime",
    description: "服务在线状态监控",
    url: "https://uptime.nianshu2022.cn",
    icon: "https://uptime.nianshu2022.cn/favicon.png"
  },
  {
    name: "MoonTV",
    description: "个人影视媒体库",
    url: "https://mv.nianshu2022.cn",
    icon: "https://mv.nianshu2022.cn/favicon.ico"
  },
  {
    name: "Nginx",
    description: "Nginx 管理面板",
    url: "https://nginx.nianshu2022.cn",
    icon: "https://nginx.nianshu2022.cn/images/favicons/favicon.ico"
  }
];

export default function ToolsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative">
      
      <div className="max-w-5xl w-full space-y-12 backdrop-blur-xl bg-white/30 dark:bg-zinc-900/30 p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl relative">
        
        {/* Back Button inside card */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
            <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md shadow-md hover:shadow-lg border border-white/50 dark:border-zinc-700/50 transition-all duration-300 hover:-translate-y-0.5">
                    <ArrowLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
                </Button>
            </Link>
        </div>

        {/* Header */}
        <div className="space-y-2 text-center sm:text-left pt-8 sm:pt-4 sm:pl-16">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-block">
                工具箱 & 实验室
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
                一些实用的小工具和实验性项目。
            </p>
        </div>

        {/* Tools & Lab */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="group p-6 bg-white/60 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 bg-blue-100/80 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                        🔗
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Online
                    </span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-zinc-800 dark:text-zinc-100 group-hover:text-blue-600 transition-colors">
                    我的导航页
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                    收录我常用的设计资源、前端开发文档和高效运营工具网站。
                </p>
                 <Button variant="outline" className="w-full text-xs gap-2 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-all">
                    立即访问 <ExternalLink className="h-3 w-3" />
                </Button>
            </div>

             <div className="group p-6 bg-white/60 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 hover:shadow-xl hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 bg-purple-100/80 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                        🎲
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        Building
                    </span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-zinc-800 dark:text-zinc-100 group-hover:text-purple-600 transition-colors">
                    随机决策器
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                    不知道中午吃什么？让代码帮你做决定。
                </p>
                <Button variant="ghost" disabled className="w-full text-xs border border-dashed border-zinc-300 dark:border-zinc-700">
                    开发中...
                </Button>
            </div>
        </div>

      </div>
    </main>
  );
}
