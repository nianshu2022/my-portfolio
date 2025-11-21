import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Server } from "lucide-react";
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

export default function PortalPage() {
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
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent inline-block">
                我的传送门
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
                私有部署的服务与站点入口。
            </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myServices.map((service) => (
                <a 
                    key={service.name} 
                    href={service.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative flex flex-col gap-4 p-6 bg-white/60 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 hover:shadow-xl hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Server className="w-16 h-16 text-cyan-500 rotate-12" />
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 p-2 shadow-sm flex items-center justify-center overflow-hidden border border-zinc-100 dark:border-zinc-800 group-hover:scale-110 transition-transform duration-300 z-10">
                            <Image 
                            src={service.icon} 
                            alt={service.name} 
                            width={32} 
                            height={32} 
                            className="w-full h-full object-contain"
                            unoptimized
                            />
                    </div>
                    
                    <div className="flex-1 min-w-0 z-10">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-1">
                            {service.name}
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                            {service.description}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs font-medium text-cyan-600 dark:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                        点击访问 <ExternalLink className="w-3 h-3" />
                    </div>
                </a>
            ))}
        </div>

      </div>
    </main>
  );
}
