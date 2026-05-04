import { getEssayBySlug, getAllEssays, getRelatedEssays, getAdjacentEssays } from "@/lib/posts";
import { Metadata } from "next";
import Markdown from "react-markdown";
import { BookOpen, Clock, Eye, ListTree } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import BusuanziCounter from "@/components/Busuanzi";
import ReadingProgress from "@/components/ReadingProgress";
import SidebarAward from "@/components/SidebarAward";
import TableOfContents from "@/components/TableOfContents";
import FloatingNav from "@/components/FloatingNav";
import DonateButton from "@/components/DonateButton";
import PostNavigation from "@/components/PostNavigation";
import RelatedPosts from "@/components/RelatedPosts";
import Comments from "@/components/Comments";
import ScrollMemory from "@/components/ScrollMemory";
import FontSizeControl from "@/components/FontSizeControl";
import ShareButton from "@/components/ShareButton";
import LikeButton from "@/components/LikeButton";
import rehypeSanitize from 'rehype-sanitize';
import { getSanitizeSchema, getMarkdownComponents } from "@/lib/markdown-components";

export async function generateStaticParams() {
    const posts = getAllEssays();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const params = await props.params;
    const slug = decodeURIComponent(params.slug);
    const post = getEssayBySlug(slug);

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

export default async function EssayPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const slug = decodeURIComponent(params.slug);
    const post = getEssayBySlug(slug);

    if (!post) {
        notFound();
    }

    const relatedEssays = getRelatedEssays(slug);
    const { prev, next } = getAdjacentEssays(slug);
    const sanitizeSchema = getSanitizeSchema();
    const mdComponents = getMarkdownComponents({ imageWidth: 1200, imageQuality: 85 });

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
            "@id": `https://blog.nianshu2022.cn/essays/${slug}`
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center px-4 py-24 sm:px-8 relative font-sans overflow-hidden">
            <ScrollMemory />
            <ReadingProgress />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <FloatingNav backUrl="/essays" />
            <div id="top" />

            <div className="max-w-7xl w-full flex flex-col lg:flex-row lg:gap-8 relative overflow-hidden">

                {/* Article Content */}
                <div className="flex-1 min-w-0 max-w-3xl mx-auto lg:mx-0">

                    {/* Cover Image */}
                    {post.cover && (
                        <div className="w-full h-64 sm:h-[28rem] relative mb-12 overflow-hidden rounded-lg border border-border shadow-sm">
                            <Image
                                src={post.cover}
                                alt={post.title}
                                fill
                                unoptimized
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>
                    )}

                    <article className="w-full pb-12 px-2 sm:px-0">
                        <header className="mb-12 text-center">
                            <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-foreground leading-tight tracking-tight font-sans">
                                {post.title}
                            </h1>

                            <div className="flex flex-wrap justify-center items-center gap-4 text-muted-foreground text-sm font-sans mb-8">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono">{post.date}</span>
                                </div>

                                <span className="text-border">|</span>

                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    <span>{post.wordCount} 字</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{post.readingTime}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    <BusuanziCounter />
                                </div>

                                <FontSizeControl />
                            </div>

                            {/* Tags */}
                            {post.tags?.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-2 mb-6">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="whitespace-nowrap rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-primary">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Mobile TOC */}
                            {post.toc.length > 0 && (
                                <details className="mt-5 rounded-md border border-border bg-card/70 p-3 lg:hidden text-left">
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
                                <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                            </div>
                        </header>

                        <div className="essay-content prose prose-lg prose-zinc dark:prose-invert max-w-none prose-headings:font-sans prose-headings:tracking-tight prose-img:rounded-xl prose-img:shadow-lg prose-a:break-all prose-img:mx-auto" style={{ fontSize: 'var(--article-font-size, 17px)' }}>
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

                        {/* Award Display */}
                        {post.award && (
                            <div className="mt-16 flex justify-center">
                                <div className="max-w-sm w-full transform hover:scale-105 transition-transform duration-500">
                                    <SidebarAward src={post.award} />
                                </div>
                            </div>
                        )}

                        {/* Copyright Section */}
                        <div className="mt-20 pt-10 border-t border-border/50">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4 text-sm text-muted-foreground font-sans">
                                <div className="flex flex-col gap-2 text-center sm:text-left">
                                    <p>
                                        <span className="font-semibold text-foreground">© 念舒</span>
                                        <span className="mx-2">·</span>
                                        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">CC BY-NC-SA 4.0</a>
                                    </p>
                                    <p className="text-xs opacity-70">
                                        转载请注明：blog.nianshu2022.cn/essays/{post.slug}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
                                    <LikeButton slug={post.slug} />
                                    <ShareButton title={post.title} />
                                    <DonateButton />
                                </div>
                            </div>

                            <PostNavigation prev={prev} next={next} basePath="/essays" />
                            <RelatedPosts posts={relatedEssays} basePath="/essays" />

                            <Comments />
                        </div>
                    </article>
                </div>

                {/* Sidebar */}
                <aside className="hidden w-64 shrink-0 lg:block">
                    <div className="sticky top-24 space-y-6">
                        <div className="garden-panel p-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground select-none">
                                目录
                            </h4>
                            <TableOfContents toc={post.toc} />
                        </div>

                        {post.award && (
                            <SidebarAward src={post.award} />
                        )}
                    </div>
                </aside>
            </div>

            {/* Mobile bottom bar */}
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
        </main>
    );
}
