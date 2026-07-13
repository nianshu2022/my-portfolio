import { getEssayBySlug, getAllEssays, getRelatedEssays, getAdjacentEssays } from "@/lib/posts";
import { Metadata } from "next";
import Markdown from "react-markdown";
import { Clock, Eye, ListTree } from "lucide-react";
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
    const sampleYear = post.date.slice(0, 4) || "0000";
    const sameYearEssays = getAllEssays()
        .filter(item => item.date.slice(0, 4) === sampleYear)
        .sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.slug.localeCompare(b.slug);
        });
    const sampleIndex = Math.max(0, sameYearEssays.findIndex(item => item.slug === post.slug)) + 1;
    const sampleNo = `NS-GS-${sampleYear}-${String(sampleIndex).padStart(3, "0")}`;

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
        <main className="relative flex min-h-screen flex-col items-center overflow-x-clip px-4 pb-24 pt-28 font-sans sm:px-8">
            <ScrollMemory />
            <ReadingProgress />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
            />

            <FloatingNav backUrl="/essays" />
            <div id="top" />

            <div className="relative flex w-full max-w-7xl flex-col lg:flex-row lg:gap-10">

                {/* Article Content */}
                <div className="mx-auto min-w-0 flex-1 lg:mx-0">
                    <article className="w-full px-0 pb-12 sm:px-4">
                        <header className="mb-10 pb-8 border-b border-border">
                            <div>
                                {/* Tags */}
                                {post.tags?.length > 0 && (
                                    <div className="mb-5 flex flex-wrap gap-2">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">#{tag}</span>
                                        ))}
                                    </div>
                                )}

                                <h1 className="max-w-4xl text-[clamp(2rem,4vw,3rem)] font-black leading-[1.15] tracking-tight text-foreground">
                                    {post.title}
                                </h1>

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
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" />
                                        {post.readingTime}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Eye className="h-3.5 w-3.5" />
                                        <BusuanziCounter />
                                    </span>
                                    <span className="ml-auto">
                                        <FontSizeControl />
                                    </span>
                                </div>
                            </div>

                            {/* Mobile TOC */}
                            {post.toc.length > 0 && (
                                <details className="mt-6 rounded-2xl border border-border bg-card/70 p-4 lg:hidden text-left">
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

                        {post.cover && (
                            <figure className="mb-10 overflow-hidden rounded-2xl border border-border">
                                <div className="relative aspect-[16/9] overflow-hidden bg-secondary sm:aspect-[21/9]">
                                    <Image
                                        src={post.cover}
                                        alt={post.title}
                                        fill
                                        unoptimized
                                        priority
                                        className="object-contain"
                                    />
                                </div>
                            </figure>
                        )}

                        <div className="mb-6 flex items-center gap-3 border-b border-border pb-3 text-xs text-muted-foreground">
                            <span className="h-px flex-1 bg-border" />
                        </div>

                        <div className="essay-content prose prose-lg prose-zinc dark:prose-invert max-w-none prose-headings:font-sans prose-headings:tracking-tight prose-a:break-all prose-img:mx-auto" style={{ fontSize: 'var(--article-font-size, 17px)' }}>
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
                        <div className="mt-20 border-t border-foreground/60 pt-10">
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
                {(post.toc.length > 0 || post.award) && (
                <aside className="hidden w-56 shrink-0 lg:block xl:w-64">
                    <div className="sticky top-24 flex flex-col gap-5">
                        {post.toc.length > 0 && (
                            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm">
                                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">目录</span>
                                    <span className="text-xs text-muted-foreground">{post.toc.length} 节</span>
                                </div>
                                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-3 custom-scrollbar">
                                    <TableOfContents toc={post.toc} />
                                </div>
                            </div>
                        )}
                        {post.award && (
                            <SidebarAward src={post.award} />
                        )}
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
