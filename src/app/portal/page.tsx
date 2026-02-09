import FloatingNav from "@/components/FloatingNav";
import { ExternalLink, Server, Globe, Clock, Tv, Activity } from "lucide-react";
import Image from "next/image";

const myServices = [
  {
    name: "With You",
    description: "记录时间的流逝，珍惜当下的每一刻。",
    url: "https://zc.nianshu2022.cn",
    icon: "https://zc.nianshu2022.cn/favicon.ico",
    CategoryIcon: Clock,
    status: "online"
  },
  {
    name: "MoonTV",
    description: "私人影视媒体库，存储我喜爱的电影与剧集。",
    url: "https://mv.nianshu2022.cn",
    icon: "https://mv.nianshu2022.cn/favicon.ico",
    CategoryIcon: Tv,
    status: "protected"
  },
  {
    name: "Nginx",
    description: "Nginx 管理面板，反向代理与负载均衡控制台。",
    url: "https://nginx.nianshu2022.cn",
    icon: "https://nginx.nianshu2022.cn/images/favicons/favicon.ico",
    CategoryIcon: Server,
    status: "protected" // Visual distinction
  }
];

export default function PortalPage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-8 py-12 sm:p-24 relative overflow-hidden">

      {/* Background Blobs (Cyan/Blue Theme) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-200/30 dark:bg-cyan-900/20 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
        <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-sky-200/30 dark:bg-sky-900/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
      </div>

      <FloatingNav backUrl="/" />

      <div className="max-w-6xl w-full grid grid-cols-1 gap-12 animate-fade-in-up">

        {/* Header */}
        <section className="relative group text-center sm:text-left pt-8 sm:pt-4 sm:pl-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 font-serif mb-4 flex flex-col sm:flex-row items-center sm:items-end gap-3 justify-center sm:justify-start">
            <span className="relative inline-flex">
              <Server className="w-12 h-12 text-cyan-500 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </span>
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              我的传送门
            </span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 font-serif max-w-2xl mx-auto sm:mx-0">
            私有部署的服务与站点入口。这里运行着我的数字生活基础设施。
          </p>
        </section>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-sm mx-auto sm:max-w-none sm:mx-0">
          {myServices.map((service, index) => (
            <a
              key={service.name}
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col gap-5 p-6 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-white/50 dark:border-zinc-700/50 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 active:scale-95 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
            >
              {/* Background Decoration Icon */}
              <div className="absolute -right-4 -top-4 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rotate-12">
                <service.CategoryIcon className="w-32 h-32 text-cyan-500" />
              </div>

              {/* Top Row: Icon + Status */}
              <div className="flex justify-between items-start z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 p-2.5 shadow-lg border border-zinc-200/50 dark:border-zinc-700/50 group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={service.icon}
                    alt={service.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                </div>

                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${service.status === 'online'
                  ? 'bg-emerald-100/80 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                  : 'bg-amber-100/80 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                  }`}>
                  <Activity className="w-3 h-3" />
                  {service.status === 'online' ? '运行中' : '受限'}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 z-10 space-y-2">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                  {service.name}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                  {service.description}
                </p>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500/0 via-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </a>
          ))}
        </div>

      </div>
    </main>
  );
}
