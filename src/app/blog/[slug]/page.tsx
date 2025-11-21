import { getPostBySlug, getAllPosts } from "@/lib/posts";
import Markdown from "react-markdown";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import rehypeSlug from 'rehype-slug';
import GithubSlugger from 'github-slugger';

// Generate static params for static export
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return <div>Post not found</div>;
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
      
       {/* Glassmorphism Container */}
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-12 backdrop-blur-xl bg-white/40 dark:bg-zinc-900/40 p-6 sm:p-12 rounded-3xl border border-white/20 shadow-2xl relative">
        
        {/* Back Button inside card */}
        <div className="absolute top-6 left-6">
             <Link href="/blog">
                <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md shadow-md hover:shadow-lg border border-white/50 dark:border-zinc-700/50 transition-all duration-300 hover:-translate-y-0.5">
                    <ArrowLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
                </Button>
            </Link>
        </div>

        {/* Main Content */}
        <article className="flex-1 min-w-0 pt-12 sm:pt-0">
            <header className="mb-10 pb-10 border-b border-zinc-200/50 dark:border-zinc-700/50 sm:pl-16">
                <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-zinc-500 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span>{post.date}</span>
                    </div>
                    <span className="text-zinc-300 dark:text-zinc-700">|</span>
                    <div className="flex gap-2">
                         {post.tags?.map(tag => (
                            <span key={tag} className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-300">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </header>

            <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-28 prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500 sm:pl-16">
                <Markdown rehypePlugins={[rehypeSlug]}>{post.content}</Markdown>
            </div>
        </article>

        {/* Sidebar TOC - Hidden on mobile, sticky on desktop */}
        <aside className="hidden lg:block w-64 shrink-0 pt-12">
            <div className="sticky top-8 p-6 bg-white/50 dark:bg-zinc-800/50 rounded-2xl border border-white/20 dark:border-zinc-700/30 backdrop-blur-md">
                <h4 className="font-bold mb-4 text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                    目录
                </h4>
                <nav className="space-y-1 text-sm relative">
                    {headings.length === 0 && <p className="text-zinc-400 text-xs pl-2">暂无目录</p>}
                    {headings.map((heading, index) => (
                        <a 
                            key={index} 
                            href={`#${heading.slug}`}
                            className={`block py-1.5 text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-l-2 border-transparent hover:border-blue-500 pl-3 -ml-[1px]
                                ${heading.level === 3 ? 'ml-2 text-xs' : ''}`}
                        >
                            {heading.text}
                        </a>
                    ))}
                </nav>
            </div>
        </aside>

      </div>
    </main>
  );
}
