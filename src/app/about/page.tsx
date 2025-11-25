import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Mail, Github, Music, Copy, User, Code, Server, Cpu, Terminal } from "lucide-react";

// Custom icon for QQ
const QQIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 1024 1024" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z" />
  </svg>
);

const contacts = [
  {
    name: "QQ",
    value: "2478951652",
    link: "mqqwpa://im/chat?chat_type=wpa&uin=2478951652&version=1&src_type=web&web_src=oicqzone.com",
    icon: QQIcon,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "group-hover:border-blue-500/50",
    action: "Copy"
  },
  {
    name: "Email",
    value: "nianshu2022@sina.cn",
    link: "mailto:nianshu2022@sina.cn",
    icon: Mail,
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "group-hover:border-orange-500/50",
    action: "Email"
  },
  {
    name: "网易云音乐",
    value: "点击访问主页",
    link: "https://music.163.com/#/user?id=1646904424",
    icon: Music,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "group-hover:border-red-600/50",
    action: "Visit"
  },
  {
    name: "GitHub",
    value: "nianshu2022",
    link: "https://github.com/nianshu2022",
    icon: Github,
    color: "text-zinc-900 dark:text-zinc-100",
    bgColor: "bg-zinc-100 dark:bg-zinc-800",
    borderColor: "group-hover:border-zinc-500/50",
    action: "Visit"
  }
];

const techStack = [
  { name: "Next.js", icon: Code },
  { name: "Tailwind CSS", icon: Terminal },
  { name: "Cloudflare", icon: Server },
  { name: "Linux / CentOS", icon: Server },
  { name: "Docker", icon: ContainerIcon },
  { name: "AI Tools", icon: Cpu },
];

// Custom icon for Container/Docker
function ContainerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
    </svg>
  )
}

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative">
      
      <div className="max-w-3xl w-full space-y-12 backdrop-blur-xl bg-white/30 dark:bg-zinc-900/30 p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl relative">
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
             <Link href="/">
                <Button 
                    variant="secondary" 
                    size="icon" 
                    className="rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-white hover:dark:bg-zinc-700 hover:scale-110 hover:shadow-xl hover:border-teal-200 dark:hover:border-teal-800 transition-all duration-300 group"
                >
                    <ArrowLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                </Button>
            </Link>
        </div>

        {/* Header */}
        <div className="space-y-2 text-center sm:text-left pt-8 sm:pt-4 sm:pl-20">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent inline-flex items-center gap-3 font-serif">
                <User className="w-8 h-8 text-teal-500 dark:text-teal-400" />
                关于我
            </h1>
        </div>

        {/* Introduction Section */}
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 font-serif">
            作为一个 00 后产品运营，我一直对技术保持着强烈的好奇心。虽然我的本职工作是运营，但我大学学的是计算机网络技术，这让我不仅关注产品的用户体验，也对它背后的实现逻辑充满兴趣。
          </p>
          <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 font-serif">
            我之前在腾讯云服务器上部署过很多开源项目，也用 AI 写过一些小工具。但我发现，这些零散的尝试往往随着服务器到期或时间推移而丢失。
          </p>
          <div className="bg-zinc-50/50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-700/50 not-prose my-8">
            <p className="font-serif font-medium text-zinc-900 dark:text-zinc-100 mb-4">所以我决定：</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                搭建一个属于自己的数字花园
              </li>
              <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                把所有代码托管到 GitHub，防止丢失
              </li>
              <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                记录下我的折腾过程，既是笔记，也是展示
              </li>
            </ul>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 font-serif flex items-center gap-2">
            <Code className="w-5 h-5 text-teal-500" />
            技术栈 & 兴趣
          </h2>
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech) => (
              <div 
                key={tech.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300 text-sm font-medium border border-zinc-200 dark:border-zinc-700/50 hover:border-teal-200 dark:hover:border-teal-800 transition-colors cursor-default"
              >
                <tech.icon className="w-4 h-4" />
                {tech.name}
              </div>
            ))}
          </div>
        </div>

        <hr className="border-zinc-200 dark:border-zinc-800/50" />

        {/* Contact Section */}
        <div>
           <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 font-serif flex items-center gap-2">
            <Mail className="w-5 h-5 text-teal-500" />
            保持联系
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contacts.map((contact) => (
                  <a 
                      key={contact.name} 
                      href={contact.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center gap-4 p-5 bg-white/60 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${contact.borderColor}`}
                  >
                      <div className={`w-12 h-12 rounded-full ${contact.bgColor} flex items-center justify-center shadow-inner`}>
                          <contact.icon className={`w-6 h-6 ${contact.color}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-0.5">
                              {contact.name}
                          </h3>
                          <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                              {contact.value}
                          </p>
                      </div>
                      
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors">
                         {contact.action === 'Copy' ? <Copy className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4 rotate-[135deg]" />}
                      </div>
                  </a>
              ))}
          </div>
        </div>

      </div>
    </main>
  );
}
