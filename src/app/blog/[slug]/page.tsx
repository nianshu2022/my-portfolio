import { getPostBySlug, getAllPosts } from "@/lib/posts";
import Markdown from "react-markdown";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, BookOpen, Shield, Eye } from "lucide-react";
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import GithubSlugger from 'github-slugger';
import { notFound } from "next/navigation";
import BusuanziCounter from "@/components/Busuanzi";
import ReadingProgress from "@/components/ReadingProgress";
import SidebarAward from "@/components/SidebarAward";
import Comments from "@/components/Comments";
import DonateButton from "@/components/DonateButton";

// Generate static params for static export
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
      
       {/* Glassmorphism Container - Changed to flex-col to allow full-width cover */}
      <div className="max-w-6xl w-full flex flex-col backdrop-blur-xl bg-white/40 dark:bg-zinc-900/40 rounded-3xl border border-white/20 shadow-2xl relative">
        
        {/* Back Button - Enhanced Style & Better Positioning */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-30">
             <Link href="/blog">
                <Button 
                    variant="secondary" 
                    size="icon" 
                    className="rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-white hover:dark:bg-zinc-700 hover:scale-110 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 group"
                >
                    <ArrowLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </Button>
            </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-12">
            {/* Main Content */}
            <article className="flex-1 min-w-0 pt-24 sm:pt-28 lg:max-w-3xl xl:max-w-4xl"> {/* Limited max width on desktop */}
                
                        <div className="px-6 sm:px-12 pb-12">
                        <header className="mb-10 pb-10 border-b border-zinc-200/50 dark:border-zinc-700/50 sm:pl-4">
                            <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-zinc-900 dark:text-zinc-50 leading-tight tracking-tight mt-8 sm:mt-0 font-sans">{post.title}</h1>
                            
                            {/* Meta Info Row */}
                    <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-zinc-500 text-sm">
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

                        {post.tags?.length > 0 && (
                            <>
                                <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">|</span>
                                <div className="flex gap-2">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md text-xs font-medium text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </header>

                <div className="blog-content prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-28 sm:pl-4">
                    <Markdown 
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSlug]}
                        components={{
                            img: (props) => {
                                const src = props.src as string || '';
                                let style: React.CSSProperties = { 
                                    height: 'auto', 
                                    borderRadius: '8px', 
                                    maxWidth: '100%',
                                    backgroundColor: 'transparent'
                                };
                                
                                try {
                                    // Parse URL query parameters
                                    const url = new URL(src, 'http://dummy.com'); // Base URL needed for relative paths
                                    const width = url.searchParams.get('width') || url.searchParams.get('w');
                                    const shadow = url.searchParams.get('shadow');

                                    if (width) {
                                        style.maxWidth = width;
                                        style.width = '100%'; // Ensure it scales down responsively
                                    }
                                    
                                    if (shadow === 'true' || shadow === '1') {
                                        // Use drop-shadow filter instead of box-shadow to respect transparency
                                        style.filter = 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))';
                                    }
                                } catch (e) {
                                    // Ignore URL parsing errors
                                }

                                return <img {...props} style={style} />;
                            }
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

        {/* Sidebar TOC - Hidden on mobile, sticky on desktop */}
        <aside className="hidden lg:block w-64 shrink-0 pt-12 pr-2">
            <div className="sticky top-8 space-y-6">
                <div className="p-5 bg-white/40 dark:bg-zinc-900/40 rounded-2xl border border-white/20 dark:border-zinc-800/50 backdrop-blur-md shadow-sm">
                    <h4 className="font-bold mb-4 text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2 select-none">
                        <span className="w-1 h-4 bg-blue-500 rounded-full shadow-sm shadow-blue-500/50"></span>
                        目录
                    </h4>
                    <nav className="space-y-0.5 text-sm relative max-h-[75vh] overflow-y-auto custom-scrollbar pr-2">
                        {headings.length === 0 && <p className="text-zinc-400 text-xs pl-2">暂无目录</p>}
                        {headings.map((heading, index) => (
                            <a 
                                key={index} 
                                href={`#${heading.slug}`}
                                className={`block py-1.5 text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 border-l-[2px] border-transparent hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 rounded-r-md
                                    ${heading.level === 3 ? 'pl-6 text-xs' : 'pl-3'}
                                `}
                            >
                                <span className="truncate block">{heading.text}</span>
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Award Section in Sidebar */}
                {post.award && (
                    <SidebarAward src={post.award} />
                )}
            </div>
        </aside>

      </div>
      </div>
    </main>
  );
}
