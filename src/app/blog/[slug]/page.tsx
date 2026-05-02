import { getPostBySlug, getAllPosts, getRelatedPosts, getAdjacentPosts } from "@/lib/posts";
import { Metadata } from "next";
import Markdown from "react-markdown";
import { Clock, BookOpen, Eye, ListTree } from "lucide-react";
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { notFound } from "next/navigation";
import BusuanziCounter from "@/components/Busuanzi";
import ReadingProgress from "@/components/ReadingProgress";
import SidebarAward from "@/components/SidebarAward";
import TableOfContents from "@/components/TableOfContents";
import FloatingNav from "@/components/FloatingNav";
import DonateButton from "@/components/DonateButton";
import RelatedPosts from "@/components/RelatedPosts";
import Comments from "@/components/Comments";
import PostNavigation from "@/components/PostNavigation";
import ScrollMemory from "@/components/ScrollMemory";
import FontSizeControl from "@/components/FontSizeControl";
import ShareButton from "@/components/ShareButton";
import LikeButton from "@/components/LikeButton";
import rehypeSanitize from 'rehype-sanitize';
import { getSanitizeSchema, getMarkdownComponents } from "@/lib/markdown-components";

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

    const sanitizeSchema = getSanitizeSchema();
    const mdComponents = getMarkdownComponents({ imageWidth: 1000, imageQuality: 75 });

    return (
        <main className="flex min-h-screen flex-col items-center px-4 py-24 sm:px-8 relative overflow-hidden">
            <ScrollMemory />
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ReadingProgress />

            <FloatingNav backUrl="/blog" />

            {/* Main Content Wrapper - Includes Article Card and Sidebar */}
            <div className="max-w-7xl w-full flex flex-col lg:flex-row lg:gap-8 relative">

                {/* Article Content Container */}
                <div className="flex-1 min-w-0 relative">
                    <div id="top" />

                    {/* Main Content */}
                    <article className="w-full pb-10 pt-10 sm:pt-16">

                        <div className="px-6 sm:px-12">
                            <header className="mb-10 border-b border-border pb-10 sm:pl-4">
                                <h1 className="mb-6 font-sans text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">{post.title}</h1>

                                {/* Meta Info Row */}
                                <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                    <div className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-2.5 py-1.5">
                                        <span className="font-mono">{post.date}</span>
                                    </div>

                                    <div className="flex items-center gap-2" title="字数统计">
                                        <BookOpen className="h-4 w-4" />
                                        <span>{post.wordCount} 字</span>
                                    </div>

                                    <div className="flex items-center gap-2" title="预估阅读时间">
                                        <Clock className="h-4 w-4" />
                                        <span>{post.readingTime}</span>
                                    </div>

                                    <div className="flex items-center gap-2" title="阅读量">
                                        <Eye className="h-4 w-4" />
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
                                            <span key={tag} className="whitespace-nowrap rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-primary">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {post.toc.length > 0 && (
                                    <details className="mt-5 rounded-md border border-border bg-card/70 p-3 lg:hidden">
                                        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-foreground">
                                            <ListTree className="h-4 w-4 text-primary" />
                                            文章目录
                                        </summary>
                                        <div className="mt-3 border-t border-border pt-3">
                                            <TableOfContents toc={post.toc} />
                                        </div>
                                    </details>
                                )}

                                {/* Decorative Separator */}
                                <div className="flex items-center justify-center gap-4 mt-8">
                                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-indigo-300 to-transparent dark:via-indigo-800"></div>
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-indigo-300 to-transparent dark:via-indigo-800"></div>
                                </div>
                            </header>

                            <div className="blog-content prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-28 sm:pl-4 prose-a:break-all prose-img:mx-auto" style={{ fontSize: 'var(--article-font-size, 16px)' }}>
                                <Markdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[
                                        [rehypeSanitize, sanitizeSchema],
                                        rehypeSlug
                                    ]}
                                    components={mdComponents}
                                >
                                    {post.content}
                                </Markdown>
                            </div>

                            {/* Copyright Section */}
                            <div className="mt-16 pt-8 border-t border-border/50">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4 text-sm text-muted-foreground font-sans">
                                    <div className="flex flex-col gap-2 text-center sm:text-left">
                                        <p>
                                            <span className="font-semibold text-foreground">© 念舒</span>
                                            <span className="mx-2">·</span>
                                            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">CC BY-NC-SA 4.0</a>
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

                {/* Sidebar */}
                <aside className="hidden w-64 shrink-0 lg:block">
                    <div className="sticky top-24 space-y-6">
                        {/* TOC Card */}
                        <div className="garden-panel p-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground select-none">
                                目录
                            </h4>
                            <TableOfContents toc={post.toc} />
                        </div>

                        {/* Award Card */}
                        {post.award && (
                            <SidebarAward src={post.award} />
                        )}
                    </div>
                </aside>

            </div >

            <div className="fixed inset-x-0 bottom-16 z-30 px-4 md:hidden">
                <div className="mx-auto flex max-w-sm items-center gap-2 rounded-md border border-border/30 bg-background/60 p-2 shadow-lg backdrop-blur-xl">
                    <a href="#top" className="flex-1 rounded-md bg-secondary px-3 py-2 text-center text-sm font-medium text-foreground transition-colors hover:bg-secondary/80">
                        回到顶部
                    </a>
                    <a href="#comments-section" className="flex-1 rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
                        去评论
                    </a>
                </div>
            </div>
        </main >
    );
}
