import { getPostBySlug, getAllPosts, getRelatedPosts, getAdjacentPosts } from "@/lib/posts";
import { Metadata } from "next";
import Markdown from "react-markdown";
import { Clock, BookOpen, Eye } from "lucide-react";
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
// import GithubSlugger from 'github-slugger'; // Removed unused import
import { notFound } from "next/navigation";
import BusuanziCounter from "@/components/Busuanzi";
import ReadingProgress from "@/components/ReadingProgress";
import SidebarAward from "@/components/SidebarAward";
import TableOfContents from "@/components/TableOfContents";
import FloatingTOC from "@/components/FloatingTOC";
import FloatingNav from "@/components/FloatingNav";
import DonateButton from "@/components/DonateButton";
import CodeBlock from "@/components/ui/CodeBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Comments from "@/components/Comments";
import PostNavigation from "@/components/PostNavigation";
import ScrollMemory from "@/components/ScrollMemory";
import FontSizeControl from "@/components/FontSizeControl";
import ShareButton from "@/components/ShareButton";
import LikeButton from "@/components/LikeButton";
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
        <main className="flex min-h-screen flex-col items-center p-4 sm:p-24 relative overflow-x-hidden">
            <ScrollMemory />
            {/* Background Blobs (Blue/Violet Theme) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
                <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-violet-200/30 dark:bg-violet-900/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
                <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
            </div>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ReadingProgress />

            <FloatingNav backUrl="/blog" />

            {/* Floating TOC - fixed position, works regardless of overflow */}
            <FloatingTOC toc={post.toc} />

            {/* Main Content Wrapper - Includes Article Card and Sidebar */}
            <div className="max-w-7xl w-full flex flex-col lg:flex-row lg:gap-8 relative">

                {/* Article Content Container */}
                <div className="flex-1 min-w-0 relative">

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
                                    <div className="ml-auto">
                                        <FontSizeControl />
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

                                {/* Decorative Separator */}
                                <div className="flex items-center justify-center gap-4 mt-8">
                                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-300 to-transparent dark:via-blue-800"></div>
                                    <div className="w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-600"></div>
                                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-300 to-transparent dark:via-blue-800"></div>
                                </div>
                            </header>

                            <div className="blog-content prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-28 sm:pl-4 prose-a:break-all prose-img:mx-auto" style={{ fontSize: 'var(--article-font-size, 16px)' }}>
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
                                                // Only proxy absolute external http/https URLs
                                                if (src.startsWith('http')) {
                                                    try {
                                                        const imageUrl = new URL(src);
                                                        // Avoid double proxying and skip local images
                                                        if (!imageUrl.hostname.includes('wsrv.nl') &&
                                                            !imageUrl.hostname.includes('nianshu2022.cn')) {
                                                            // Optimized parameters: w=1000, q=75 for better balance of quality and speed
                                                            imageSrc = `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=1000&q=75&output=webp`;
                                                        }
                                                    } catch {
                                                        // Fallback for invalid URLs
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
                                        ),
                                        pre: (props) => <CodeBlock {...props} />
                                    }}
                                >
                                    {post.content}
                                </Markdown>
                            </div>

                            {/* Copyright Section */}
                            <div className="mt-16 pt-8 border-t border-zinc-200/50 dark:border-zinc-700/50 sm:ml-4">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4 text-sm text-zinc-400 font-serif">
                                    <div className="flex flex-col gap-2 text-center sm:text-left">
                                        <p>
                                            <span className="font-semibold text-zinc-500 dark:text-zinc-300">© 念舒</span>
                                            <span className="mx-2">·</span>
                                            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">CC BY-NC-SA 4.0</a>
                                        </p>
                                        <p className="text-xs opacity-70">
                                            转载请注明：blog.nianshu2022.cn/blog/{post.slug}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
                                        <LikeButton slug={post.slug} />
                                        <ShareButton title={post.title} />
                                        <DonateButton />
                                    </div>
                                </div>
                            </div>

                            <PostNavigation prev={prev} next={next} />

                            <RelatedPosts posts={relatedPosts} />

                            <Comments />
                        </div>
                    </article>
                </div>

                {/* Sidebar - Separated Card */}
                {/* Award Sidebar (only if post has award) */}
                {post.award && (
                    <aside className="hidden xl:block w-72 shrink-0">
                        <div className="rounded-3xl border-0 overflow-hidden ml-4 mt-16">
                            <SidebarAward src={post.award} />
                        </div>
                    </aside>
                )}

            </div >
        </main >
    );
}
