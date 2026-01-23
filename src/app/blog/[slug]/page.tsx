import { getPostBySlug, getAllPosts, getRelatedPosts, getAdjacentPosts } from "@/lib/posts";
import { Metadata } from "next";
import Markdown from "react-markdown";
import { Clock, BookOpen, Shield, Eye } from "lucide-react";
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
// import GithubSlugger from 'github-slugger'; // Removed unused import
import { notFound } from "next/navigation";
import BusuanziCounter from "@/components/Busuanzi";
import ReadingProgress from "@/components/ReadingProgress";
import SidebarAward from "@/components/SidebarAward";
import TableOfContents from "@/components/TableOfContents";
import FloatingNav from "@/components/FloatingNav";
import Comments from "@/components/Comments";
import DonateButton from "@/components/DonateButton";
import RelatedPosts from "@/components/RelatedPosts";
import PostNavigation from "@/components/PostNavigation";
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await props.params;
    const post = getPostBySlug(slug);

    if (!post) {
        return {
            title: "文章未找到",
        };
    }

    return {
        title: post.title,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            publishedTime: post.date,
            authors: ["念舒"],
            images: post.cover ? [{ url: post.cover }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            images: post.cover ? [post.cover] : undefined,
        },
    };
}

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params;
    const post = getPostBySlug(slug);
    const relatedPosts = getRelatedPosts(slug);
    const { prev, next } = getAdjacentPosts(slug);

    if (!post) {
        notFound();
    }

    // JSON-LD structured data for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.description,
        "datePublished": post.date,
        "author": {
            "@type": "Person",
            "name": "念舒",
            "url": "https://blog.nianshu2022.cn/about"
        },
        "publisher": {
            "@type": "Person",
            "name": "念舒"
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://blog.nianshu2022.cn/blog/${slug}`
        }
    };

    // TOC is now handled in posts.ts

    // Custom schema for rehype-sanitize to match previous DOMPurify configuration
    const sanitizeSchema = {
        ...defaultSchema,
        tagNames: [
            ...(defaultSchema.tagNames || []),
            'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'br', 'hr', 'span', 'div',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
        ],
        attributes: {
            ...defaultSchema.attributes,
            'img': ['src', 'alt', 'title', 'width', 'height', 'style', 'className'],
            '*': ['className', 'id', 'style'],
            'h1': ['id', 'className', 'style'],
            'h2': ['id', 'className', 'style'],
            'h3': ['id', 'className', 'style'],
            'h4': ['id', 'className', 'style'],
            'h5': ['id', 'className', 'style'],
            'h6': ['id', 'className', 'style']
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-4 sm:p-24 relative">
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

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
                                    rehypePlugins={[
                                        [rehypeSanitize, sanitizeSchema],
                                        rehypeSlug
                                    ]}
                                    components={{
                                        img: (props) => {
                                            const src = props.src as string || '';
                                            let imageSrc = src;

                                            // 验证图片URL安全性
                                            try {
                                                const url = new URL(src, 'http://dummy.com');
                                                const protocol = url.protocol;

                                                // 只允许安全协议
                                                if (!['http:', 'https:', 'data:'].includes(protocol)) {
                                                    return <span className="text-red-500">[无效的图片链接]</span>;
                                                }

                                                // 防止data URI过长攻击
                                                if (protocol === 'data:' && src.length > 10000) {
                                                    return <span className="text-red-500">[图片过大]</span>;
                                                }
                                            } catch {
                                                return <span className="text-red-500">[无效的URL]</span>;
                                            }

                                            const style: React.CSSProperties = {
                                                height: 'auto',
                                                borderRadius: '8px',
                                                backgroundColor: 'transparent',
                                                verticalAlign: 'top'
                                            };
                                            let className = "rounded-lg";

                                            try {
                                                const url = new URL(src, 'http://dummy.com');
                                                const width = url.searchParams.get('width') || url.searchParams.get('w');
                                                const shadow = url.searchParams.get('shadow');

                                                if (width) {
                                                    // 验证宽度参数
                                                    const widthValue = parseInt(width);
                                                    if (isNaN(widthValue) || widthValue < 1 || widthValue > 2000) {
                                                        style.width = '100%';
                                                    } else {
                                                        style.width = width;
                                                    }
                                                    style.maxWidth = '100%';
                                                    className += " block mx-auto mb-6 sm:inline-block sm:mx-0 sm:mb-4 sm:mr-8";
                                                } else {
                                                    style.maxWidth = '100%';
                                                    className += " block mx-auto";
                                                }

                                                if (shadow === 'true' || shadow === '1') {
                                                    style.filter = 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))';
                                                }

                                                // Image Proxy Logic (wsrv.nl)
                                                // Only proxy http/https URLs, ignore data: and relative URLs
                                                if (url.protocol === 'http:' || url.protocol === 'https:') {
                                                    // Avoid double proxying
                                                    if (!url.hostname.includes('wsrv.nl')) {
                                                        const originalSrc = src;
                                                        // We pass the original source to wsrv.nl
                                                        imageSrc = `https://wsrv.nl/?url=${encodeURIComponent(originalSrc)}&w=1200&q=85&output=webp`;
                                                    }
                                                }
                                            } catch {
                                                // Ignore URL parsing errors
                                            }

                                            return <img {...props} src={imageSrc} alt={props.alt || ''} style={style} className={className} referrerPolicy="no-referrer" loading="lazy" />;
                                        },
                                        table: (props) => (
                                            <div className="overflow-x-auto my-8 custom-scrollbar rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                                <table {...props} className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 border-collapse" />
                                            </div>
                                        ),
                                        thead: (props) => (
                                            <thead {...props} className="bg-zinc-50/50 dark:bg-zinc-800/50" />
                                        ),
                                        th: (props) => (
                                            <th {...props} className="px-4 py-3 text-left text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800" />
                                        ),
                                        td: (props) => (
                                            <td {...props} className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800/50" />
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

                            <PostNavigation prev={prev} next={next} />

                            <RelatedPosts posts={relatedPosts} />

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
                            <TableOfContents toc={post.toc} />
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
