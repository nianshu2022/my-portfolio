import { friendLinks } from "@/lib/friends-data";
import FloatingNav from "@/components/FloatingNav";
import { Heart, Link2 } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "友链 | 念舒",
    description: "分享我喜爱的网站和博客。",
};

export default function FriendsPage() {
    return (
        <main className="min-h-screen pt-24 pb-20 px-6 sm:px-12 max-w-5xl mx-auto font-sans">
            {/* Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-rose-200/30 dark:bg-rose-900/10 rounded-full blur-[100px] opacity-70" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-pink-200/30 dark:bg-pink-900/10 rounded-full blur-[100px] opacity-70" />
            </div>

            <FloatingNav backUrl="/" />

            {/* Header */}
            <header className="mb-12 text-center animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm font-medium mb-4 border border-zinc-200 dark:border-zinc-700">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>友情链接</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 font-serif mb-4">
                    我的友链
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
                    这里收录了我喜爱的网站和博客，都是优质的内容来源。如果你也想交换友链，欢迎联系我 :)
                </p>
            </header>

            {/* Friend Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                {friendLinks.map((friend, idx) => (
                    <a
                        key={friend.name}
                        href={friend.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col gap-4 p-6 rounded-3xl bg-white/60 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-700/50 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50/50 dark:hover:bg-rose-900/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-100/50 dark:hover:shadow-rose-900/20"
                        style={{ animationDelay: `${100 + idx * 80}ms` }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-zinc-200/50 dark:border-zinc-700/50 group-hover:scale-110 transition-transform duration-300">
                                <Image
                                    src={friend.avatar}
                                    alt={friend.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors flex items-center gap-1.5 truncate">
                                    {friend.name}
                                    <Link2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                </h3>
                                {friend.tags && (
                                    <div className="flex gap-1 mt-1 flex-wrap">
                                        {friend.tags.map((tag) => (
                                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                            {friend.description}
                        </p>
                    </a>
                ))}

                {/* Add Friend CTA */}
                <a
                    href="mailto:nianshu2022@sina.cn?subject=%E7%94%B3%E8%AF%B7%E5%8F%8B%E9%93%BE"
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-400 dark:hover:text-rose-600 transition-all duration-300 cursor-pointer"
                >
                    <Heart className="w-8 h-8" />
                    <div className="text-center">
                        <p className="font-medium text-sm">申请友链</p>
                        <p className="text-xs mt-1">欢迎来信交换友链</p>
                    </div>
                </a>
            </div>
        </main>
    );
}
