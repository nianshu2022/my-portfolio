import { getPostBySlug, getAllPosts, getRelatedPosts, getAdjacentPosts } from "@/lib/posts";
import { Metadata } from "next";
import Markdown from "react-markdown";
import { Eye, ListTree } from "lucide-react";
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
        return { title: "文章未找到" };
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

    if (!post) notFound();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.description,
        "datePublished": post.date,
        "author": { "@type": "Person", "name": "念舒", "url": "https://blog.nianshu2022.cn/about" },
        "publisher": { "@type": "Person", "name": "念舒" },
        "mainEntityOfPage": { "@type": "WebPage", "@id": `https://blog.nianshu2022.cn/blog/${slug}` }
    };

    const sanitizeSchema = getSanitizeSchema();
    const mdComponents = getMarkdownComponents({ imageWidth: 1000, imageQuality: 75 });

    return (
        <main className="relative flex min-h-screen flex-col items-center overflow-x-clip px-4 pb-24 pt-28 sm:px-8">
            <ScrollMemory />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
            <ReadingProgress />
            <FloatingNav backUrl="/blog" />

            <div className="relative flex w-full max-w-7xl flex-col lg:flex-row lg:gap-12">

                {/* ── Article ── */}
                <div className="relative min-w-0 flex-1">
                    <div id="top" />
                    <article className="w-full pb-10">

                        {/* ── Article Header ── */}
                        <header className="mb-10 pb-8 border-b border-border">

                            {/* Tags (top pills) */}
                            {post.tags?.length > 0 && (
                                <div className="mb-5 flex flex-wrap gap-2">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Title */}
                            <h1 className="max-w-4xl font-sans text-[clamp(2rem,4vw,3rem)] font-black leading-[1.15] tracking-tight text-foreground">
                                {post.title}
                            </h1>

                            {/* Description */}
                            {post.description && (
                                <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground border-l-4 border-primary/40 pl-4">
                                    {post.description}
                                </p>
                            )}

                            {/* Meta row */}
                            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                                <time dateTime={post.date} className="flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                                    {post.date}
                                </time>
                                <span>{post.wordCount} 字</span>
                                <span>{post.readingTime}</span>
                                <span className="flex items-center gap-1.5">
                                    <Eye className="h-3.5 w-3.5" />
                                    <BusuanziCounter />
                                </span>
                                <span className="ml-auto">
                                    <FontSizeControl />
                                </span>
                            </div>

                            {/* Mobile TOC */}
                            {post.toc.length > 0 && (
                                <details className="mt-6 rounded-2xl border border-border bg-card/70 p-4 lg:hidden">
                                    <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-foreground">
                                        <ListTree className="h-4 w-4 text-primary" />
                                        文章目录
                                    </summary>
                                    <div className="mt-4 border-t border-border pt-4">
                                        <TableOfContents toc={post.toc} />
                                    </div>
                                </details>
                            )}
                        </header>

                        {/* ── Markdown Content ── */}
                        <div
                            className="blog-content prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-28 prose-a:break-all prose-img:mx-auto"
                            style={{ fontSize: 'var(--article-font-size, 16px)' }}
                        >
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

                        {/* ── Footer ── */}
                        <div className="mt-16 border-t border-border pt-8">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2 text-sm text-muted-foreground">
                                <div className="flex flex-col gap-1.5 text-center sm:text-left">
                                    <p>
                                        <span className="font-semibold text-foreground">© 念舒</span>
                                        <span className="mx-2">·</span>
                                        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">CC BY-NC-SA 4.0</a>
                                    </p>
                                    <p className="text-xs opacity-70">转载请注明：blog.nianshu2022.cn/blog/{post.slug}</p>
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
                    </article>
                </div>

                {/* ── Sidebar ── */}
                {(post.toc.length > 0 || post.award) && (
                    <aside className="hidden w-56 shrink-0 lg:block xl:w-64">
                        <div className="sticky top-24 flex flex-col gap-5">
                            {post.toc.length > 0 && (
                                <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm">
                                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                                        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                            目录
                                        </span>
                                        <span className="text-xs text-muted-foreground">{post.toc.length} 节</span>
                                    </div>
                                    <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-3 custom-scrollbar">
                                        <TableOfContents toc={post.toc} />
                                    </div>
                                </div>
                            )}
                            {post.award && <SidebarAward src={post.award} />}
                        </div>
                    </aside>
                )}
            </div>

            {/* Mobile bottom bar */}
            <div className="fixed inset-x-0 bottom-16 z-30 flex justify-center px-4 md:hidden">
                <div className="flex items-center gap-2 rounded-full border border-border bg-background/90 p-1.5 shadow-lg backdrop-blur-xl">
                    <a href="#top" className="rounded-full bg-secondary px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80">
                        回顶部
                    </a>
                    <a href="#comments-section" className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
                        去评论
                    </a>
                </div>
            </div>
        </main>
    );
}
