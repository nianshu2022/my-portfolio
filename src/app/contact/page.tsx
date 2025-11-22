import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Mail, Github, Music, Copy, Check, User } from "lucide-react";
import Image from "next/image";

// Custom icon for QQ since it's not in lucide
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

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative">
      
      <div className="max-w-3xl w-full space-y-12 backdrop-blur-xl bg-white/30 dark:bg-zinc-900/30 p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl relative">
        
        {/* Back Button inside card */}
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
                保持联系
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-serif">
                你可以通过以下方式找到我。
            </p>
        </div>

        {/* Contacts Grid */}
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
    </main>
  );
}
