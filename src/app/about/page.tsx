import FloatingNav from "@/components/FloatingNav";
import Image from "next/image";
import { ArrowLeft, Mail, Github, Music, Copy, User, Code, Server, Cpu, Terminal, Sparkles, Rocket, BookOpen, Coffee, Briefcase } from "lucide-react";

// Custom icon for QQ
const QQIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 1024 1024" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z" />
  </svg>
);

// Custom icon for Container/Docker
function ContainerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
    </svg>
  )
}

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
  { name: "Next.js", icon: Code, desc: "React 框架" },
  { name: "Tailwind CSS", icon: Terminal, desc: "样式方案" },
  { name: "Cloudflare", icon: Server, desc: "边缘部署" },
  { name: "Linux / CentOS", icon: Server, desc: "系统运维" },
  { name: "Docker", icon: ContainerIcon, desc: "容器化" },
  { name: "AI Tools", icon: Cpu, desc: "生产力工具" },
];

const timeline = [
  {
    title: "起点",
    role: "计算机网络技术",
    description: "我的旅程始于计算机网络技术专业。这为我理解数字世界的连接方式打下了坚实的基础。",
    icon: BookOpen,
    date: "求学"
  },
  {
    title: "职业生涯",
    role: "产品运营",
    description: "作为 00 后产品运营，我致力于在用户体验与技术可行性之间架起桥梁，不仅关注“是什么”，更对背后的“为什么”充满好奇。",
    icon: Briefcase,
    date: "职场"
  },
  {
    title: "探索",
    role: "开源与 AI",
    description: "热衷于折腾新技术。从在腾讯云上部署各种开源项目，到利用 AI 助手开发实用小工具，乐此不疲。",
    icon: Rocket,
    date: "热爱"
  },
  {
    title: "新篇章",
    role: "数字花园",
    description: "决定搭建这个个人博客。为了记录、分享，也为了确保我的数字足迹不会随时间流逝或服务器过期而消失。",
    icon: Sparkles,
    date: "现在"
  }
];

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative overflow-hidden">

      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-teal-200/30 dark:bg-teal-900/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
      </div>

      <FloatingNav backUrl="/" />

      <div className="max-w-4xl w-full grid grid-cols-1 gap-12 animate-fade-in-up">

        {/* Header / Hero Section */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative backdrop-blur-xl bg-white/40 dark:bg-zinc-900/40 p-8 sm:p-12 rounded-3xl border border-white/50 dark:border-zinc-700/50 shadow-2xl flex flex-col sm:flex-row items-center gap-8">

            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-teal-400 to-indigo-500 p-1 animate-spin-slow">
                <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 p-1 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/img/avatar.png"
                    alt="念舒 Avatar"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full rounded-full"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>

            <div className="text-center sm:text-left space-y-4 flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent font-serif">
                你好，我是 念舒。
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-300 font-serif leading-relaxed max-w-2xl">
                白天是产品运营，晚上是代码探索者。我将用户思维与技术探索相结合，致力于创造优秀的数字体验。
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-2">
                <span className="px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800">
                  产品运营
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
                  技术爱好者
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800">
                  数字花园
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 font-serif flex items-center gap-2 pl-2">
            <Coffee className="w-6 h-6 text-teal-500" />
            我的旅程
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timeline.map((item, index) => (
              <div key={index} className="group relative p-6 bg-white/50 dark:bg-zinc-900/30 hover:bg-white/80 dark:hover:bg-zinc-800/50 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 text-zinc-500 dark:text-zinc-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 mb-1 uppercase tracking-wider">{item.date}</div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-serif">{item.title}</h3>
                    <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">{item.role}</div>
                    <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 font-serif flex items-center gap-2 pl-2">
            <Code className="w-6 h-6 text-indigo-500" />
            技术栈
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-300 text-center group hover:shadow-md"
              >
                <tech.icon className="w-8 h-8 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">{tech.name}</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">{tech.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-zinc-200 dark:border-zinc-800/50" />

        {/* Contact Section */}
        <section className="space-y-6 pb-12">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 font-serif flex items-center gap-2 pl-2">
            <Mail className="w-6 h-6 text-purple-500" />
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
        </section>

      </div>
    </main>
  );
}
