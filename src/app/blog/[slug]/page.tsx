import { getPostBySlug, getAllPosts } from "@/lib/posts";
import Markdown from "react-markdown";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, BookOpen, Shield, Eye, Home } from "lucide-react";
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import GithubSlugger from 'github-slugger';
import { notFound } from "next/navigation";
import BusuanziCounter from "@/components/Busuanzi";
import ReadingProgress from "@/components/ReadingProgress";
import SidebarAward from "@/components/SidebarAward";
import TableOfContents from "@/components/TableOfContents";
import FloatingNav from "@/components/FloatingNav";
import Comments from "@/components/Comments";

import DonateButton from "@/components/DonateButton";
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  // Decode slug to ensure we can find the file (e.g. Chinese characters)
  const slug = decodeURIComponent(params.slug);
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const slugger = new GithubSlugger();
  const regX = /^(#{2,3})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = regX.exec(post.content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2],
      slug: slugger.slug(match[2])
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-24 relative">
      <ReadingProgress />
      
      <FloatingNav backUrl="/blog" />

       {/* Main Content Wrapper - Includes Article Card and Sidebar */}
       <div className="max-w-7xl w-full flex flex-col lg:flex-row lg:gap-8 relative">
      
      {/* Article Card Container */}
      <div className="flex-1 min-w-0 backdrop-blur-xl bg-white/40 dark:bg-zinc-900/40 rounded-3xl border border-white/20 shadow-2xl relative">
        
            {/* Main Content */}
            <article className="w-full pt-10 sm:pt-16 pb-10">
                
                        <div className="px-6 sm:px-12">
                        <header className="mb-10 pb-10 border-b border-zinc-200/50 dark:border-zinc-700/50 sm:pl-4">
                            <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-zinc-900 dark:text-zinc-50 leading-tight tracking-tight mt-8 sm:mt-0 font-sans">{post.title}</h1>
                            
                            {/* Meta Info Row */}
                    <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-zinc-500 text-sm mb-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="font-mono">{post.date}</span>
                        </div>
                        
                        <div className="flex items-center gap-2" title="字数统计">
                            <BookOpen className="w-4 h-4" />
                            <span>{post.wordCount} 字</span>
                        </div>

                        <div className="flex items-center gap-2" title="预估阅读时间">
                            <Clock className="w-4 h-4" />
                            <span>{post.readingTime}</span>
                        </div>

                        <div className="flex items-center gap-2" title="阅读量">
                            <Eye className="w-4 h-4" />
                            <BusuanziCounter />
                        </div>
                    </div>

                    {/* Tags Row - Optimized for mobile */}
                    {post.tags?.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar -ml-1 pl-1">
                            {post.tags.map(tag => (
                                <span key={tag} className="whitespace-nowrap bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md text-xs font-medium text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                <div className="blog-content prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-28 sm:pl-4 prose-a:break-all prose-img:mx-auto">
                    <Markdown 
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSlug]}
                        components={{
                            img: (props) => {
                                const src = props.src as string || '';
                                let style: React.CSSProperties = { 
                                    height: 'auto', 
                                    borderRadius: '8px', 
                                    backgroundColor: 'transparent',
                                    verticalAlign: 'top' // 顶部对齐，防止高度不一致时错位
                                };
                                let className = "rounded-lg"; // 默认类名，移到 try 外部
                                
                                try {
                                    // Parse URL query parameters
                                    const url = new URL(src, 'http://dummy.com');
                                    const width = url.searchParams.get('width') || url.searchParams.get('w');
                                    const shadow = url.searchParams.get('shadow');

                                    if (width) {
                                        style.width = width;      // 设置固定宽度
                                        style.maxWidth = '100%';  // 保证移动端不溢出
                                        
                                        // 关键修改：使用 Tailwind 响应式类
                                        // 移动端 (默认): block + mx-auto (独占一行居中) + mb-4 (下间距)
                                        // PC端 (sm以上): inline-block + mx-0 (靠左并排) + mr-8 (右间距)
                                        className += " block mx-auto mb-6 sm:inline-block sm:mx-0 sm:mb-4 sm:mr-8";
                                    } else {
                                        style.maxWidth = '100%';
                                        className += " block mx-auto"; // 默认居中
                                    }
                                    
                                    if (shadow === 'true' || shadow === '1') {
                                        style.filter = 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))';
                                    }
                                } catch (e) {
                                    // Ignore URL parsing errors
                                }

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

                {/* Copyright Section */}
                <div className="mt-16 pt-8 border-t border-zinc-200/50 dark:border-zinc-700/50 sm:ml-4">
                    <div className="bg-zinc-50/50 dark:bg-zinc-800/30 rounded-xl p-6 border border-zinc-100 dark:border-zinc-700/50 flex flex-col gap-2 text-sm text-zinc-500 dark:text-zinc-400 relative overflow-hidden group">
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
                            转载请注明出处：<span className="select-all bg-white dark:bg-zinc-900 px-1 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">https://blog.nianshu2022.cn/blog/{post.slug}</span>
                        </p>
                        <div className="z-10 pt-2">
                            <DonateButton />
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <Comments />
            </div>
        </article>
      </div>

        {/* Sidebar - Separated Card */}
        <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-6 space-y-6">
                {/* TOC Card */}
                <div className="p-6 bg-white/40 dark:bg-zinc-900/40 rounded-3xl border border-white/20 dark:border-zinc-800/50 backdrop-blur-xl shadow-xl max-h-[80vh] flex flex-col snap-y snap-mandatory overflow-y-auto custom-scrollbar pr-1">
                    <h4 className="font-bold mb-4 text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2 select-none">
                        <span className="w-1 h-4 bg-blue-500 rounded-full shadow-sm shadow-blue-500/50"></span>
                        目录
                    </h4>
                    <TableOfContents headings={headings} />
                </div>

                {/* Award Card */}
                {post.award && (
                    <div className="rounded-3xl border border-white/20 dark:border-zinc-800/50 shadow-xl overflow-hidden backdrop-blur-xl bg-white/40 dark:bg-zinc-900/40">
                         <SidebarAward src={post.award} />
                    </div>
                )}
            </div>
        </aside>

      </div>
    </main>
  );
}
