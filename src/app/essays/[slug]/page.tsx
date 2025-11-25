import { getEssayBySlug, getAllEssays } from "@/lib/posts";
import Markdown from "react-markdown";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Eye, Shield, Home } from "lucide-react";
import { notFound } from "next/navigation";
import remarkGfm from 'remark-gfm';
import BusuanziCounter from "@/components/Busuanzi";
import ReadingProgress from "@/components/ReadingProgress";
import SidebarAward from "@/components/SidebarAward";
import FloatingNav from "@/components/FloatingNav";
import Comments from "@/components/Comments";
import DonateButton from "@/components/DonateButton";

export async function generateStaticParams() {
  const posts = getAllEssays();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function EssayPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = decodeURIComponent(params.slug);
  const post = getEssayBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-24 relative font-serif">
      <ReadingProgress />
      
      <FloatingNav backUrl="/essays" />
      
      <div className="max-w-3xl w-full flex flex-col backdrop-blur-xl bg-white/40 dark:bg-zinc-900/40 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden">
        
        {/* Cover Image */}
        {post.cover && (
            <div className="w-full h-64 sm:h-80 relative">
                <img 
                    src={post.cover} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/40 dark:to-zinc-900/40"></div>
            </div>
        )}

        {/* Back Button Removed from here */}

        <article className={`w-full pb-12 px-6 sm:px-16 ${post.cover ? 'pt-10 sm:pt-12' : 'pt-24 sm:pt-28'}`}>
            <header className="mb-12 text-center">
                <h1 className="text-3xl sm:text-5xl font-bold mb-6 text-zinc-900 dark:text-zinc-50 leading-tight tracking-tight font-serif">
                    {post.title}
                </h1>
                
                <div className="flex flex-wrap justify-center items-center gap-4 text-zinc-500 text-sm font-sans">
                    <div className="flex items-center gap-2">
                        <span className="font-mono">{post.date}</span>
                    </div>
                    
                    <span className="text-zinc-300">|</span>

                    <div className="flex items-center gap-2">
                        <BookOpen className="w-3 h-3" />
                        <span>{post.wordCount} 字</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>{post.readingTime}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        <BusuanziCounter />
                    </div>
                </div>
            </header>

            <div className="essay-content prose prose-lg prose-zinc dark:prose-invert max-w-none prose-p:indent-8 prose-p:text-justify prose-headings:font-serif prose-headings:text-center prose-img:rounded-xl prose-img:shadow-lg prose-a:break-all prose-img:mx-auto">
                <Markdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                        img: (props) => {
                            const src = props.src as string || '';
                            let style: React.CSSProperties = { 
                                height: 'auto', 
                                borderRadius: '8px', 
                                backgroundColor: 'transparent',
                                verticalAlign: 'top'
                            };
                            let className = "rounded-lg block mx-auto"; // 默认居中

                            try {
                                const url = new URL(src, 'http://dummy.com');
                                const width = url.searchParams.get('width') || url.searchParams.get('w');
                                const shadow = url.searchParams.get('shadow');

                                if (width) {
                                    style.width = width;
                                    style.maxWidth = '100%';
                                    className += " mb-6 sm:inline-block sm:mx-0 sm:mb-4 sm:mr-8";
                                }

                                if (shadow === 'true' || shadow === '1') {
                                    style.filter = 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))';
                                }
                            } catch (e) { }

                            return <img {...props} style={style} className={className} referrerPolicy="no-referrer" />;
                        },
                        table: (props) => (
                            <div className="overflow-x-auto my-8 custom-scrollbar rounded-lg border border-zinc-200 dark:border-zinc-700">
                                <table {...props} className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700" />
                            </div>
                        )
                    }}
                >
                    {post.content}
                </Markdown>
            </div>

            {/* Award Display - Centered for essays */}
            {post.award && (
                <div className="mt-12 flex justify-center">
                     <div className="max-w-sm w-full transform hover:scale-105 transition-transform duration-500">
                        <SidebarAward src={post.award} />
                     </div>
                </div>
            )}

            <div className="mt-16 pt-8 border-t border-zinc-200/50 dark:border-zinc-700/50">
                 {/* Copyright Section */}
                 <div className="bg-zinc-50/50 dark:bg-zinc-800/30 rounded-xl p-6 border border-zinc-100 dark:border-zinc-700/50 flex flex-col gap-2 text-sm text-zinc-500 dark:text-zinc-400 relative overflow-hidden group font-sans text-left mb-8">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Shield className="w-24 h-24 -rotate-12" />
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-200 z-10">
                        <Shield className="w-4 h-4" />
                        <span>版权声明</span>
                    </div>
                    <p className="z-10">
                        本文由 <span className="font-medium text-zinc-700 dark:text-zinc-300">念舒</span> 原创，采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">CC BY-NC-SA 4.0</a> 协议进行许可。
                    </p>
                    <p className="z-10">
                        转载请注明出处：<span className="select-all bg-white dark:bg-zinc-900 px-1 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">https://blog.nianshu2022.cn/essays/{post.slug}</span>
                    </p>
                    <div className="z-10 pt-2">
                        <DonateButton />
                    </div>
                </div>

                <div className="text-center text-sm text-zinc-400 font-serif italic">
                    <p>—— 完 ——</p>
                </div>
                <div className="mt-8">
                     <Comments />
                </div>
            </div>
        </article>
      </div>
    </main>
  );
}

