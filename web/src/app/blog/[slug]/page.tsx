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
    const dossierYear = post.date.slice(0, 4) || "0000";
    const sameYearPosts = getAllPosts()
        .filter(item => item.date.slice(0, 4) === dossierYear)
        .sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.slug.localeCompare(b.slug);
        });
    const dossierIndex = Math.max(0, sameYearPosts.findIndex(item => item.slug === post.slug)) + 1;
    const dossierNo = `NS-${dossierYear}-${String(dossierIndex).padStart(3, "0")}`;

    return (
        <main className="relative flex min-h-screen flex-col items-center overflow-hidden px-4 pb-24 pt-28 sm:px-8">
            <ScrollMemory />
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ReadingProgress />

            <FloatingNav backUrl="/blog" />

            {/* Main Content Wrapper - Includes Article Card and Sidebar */}
            <div className="relative flex w-full max-w-7xl flex-col lg:flex-row lg:gap-10">

                {/* Article Content Container */}
                <div className="relative min-w-0 flex-1">
                    <div id="top" />

                    {/* Main Content */}
                    <article className="w-full pb-10">

                        <div className="px-0 sm:px-4">
                            <header className="mb-10 border-y border-foreground/75 py-8">
                                <div className="mb-6 flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
                                    <span className="border border-primary px-2 py-1 font-bold text-primary">技术案卷</span>
                                    <span>公共档案 001 号</span>
                                    <span>{dossierNo}</span>
                                </div>

                                <h1 className="max-w-4xl font-sans text-[clamp(2.15rem,3.7vw,3.2rem)] font-black leading-[1.14] tracking-normal text-foreground">
                                    {post.title}
                                </h1>

                                {post.description && (
                                    <p className="mt-5 max-w-3xl border-l-4 border-primary pl-4 text-base leading-8 text-muted-foreground">
                                        {post.description}
                                    </p>
                                )}

                                <div className="mt-6 flex flex-wrap border-y border-foreground/45 bg-card/50 font-mono text-xs">
                                    <span className="border-b border-border px-3 py-2 font-bold text-foreground sm:border-b-0 sm:border-r">案卷登记</span>
                                    <span className="border-b border-border px-3 py-2 sm:border-b-0 sm:border-r">编号 {dossierNo}</span>
                                    <span className="border-b border-border px-3 py-2 sm:border-b-0 sm:border-r">日期 {post.date}</span>
                                    <span className="border-b border-border px-3 py-2 sm:border-b-0 sm:border-r">字数 {post.wordCount}</span>
                                    <span className="border-b border-border px-3 py-2 sm:border-b-0 sm:border-r">阅读 {post.readingTime}</span>
                                    <span className="px-3 py-2 text-primary">已归档</span>
                                </div>

                                <div className="mt-6 grid gap-4 border-y border-border/80 py-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2" title="阅读量">
                                            <Eye className="h-4 w-4" />
                                            <BusuanziCounter />
                                        </div>
                                        <FontSizeControl />
                                    </div>

                                    {post.tags?.length > 0 && (
                                        <div className="-ml-1 flex gap-2 overflow-x-auto pb-1 pl-1 custom-scrollbar">
                                            <span className="whitespace-nowrap border border-foreground/40 bg-foreground px-2.5 py-1 font-mono text-xs font-bold text-background">
                                                技术标记
                                            </span>
                                            {post.tags.map(tag => (
                                                <span key={tag} className="whitespace-nowrap border border-border bg-card px-2.5 py-1 font-mono text-xs font-medium text-primary">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {post.toc.length > 0 && (
                                    <details className="mt-5 border border-border bg-card/70 p-3 lg:hidden">
                                        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-foreground">
                                            <ListTree className="h-4 w-4 text-primary" />
                                            文章目录
                                        </summary>
                                        <div className="mt-3 border-t border-border pt-3">
                                            <TableOfContents toc={post.toc} />
                                        </div>
                                    </details>
                                )}

                            </header>

                            <div className="mb-6 flex items-center gap-3 border-b border-foreground/55 pb-3 font-mono text-xs text-muted-foreground">
                                <span className="border border-foreground/40 px-2 py-1">正文记录</span>
                                <span className="h-px flex-1 bg-border" aria-hidden="true" />
                                <span>{dossierNo}</span>
                            </div>

                            <div className="blog-content prose prose-zinc dark:prose-invert max-w-none border-l border-foreground/20 pl-4 prose-headings:scroll-mt-28 prose-a:break-all prose-img:mx-auto sm:pl-6" style={{ fontSize: 'var(--article-font-size, 16px)' }}>
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
                            <div className="mt-16 border-t border-foreground/60 pt-8">
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
                        <div className="garden-panel max-h-[80vh] overflow-y-auto p-5 custom-scrollbar">
                            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground select-none">
                                案卷目录
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
                <div className="mx-auto flex max-w-sm items-center gap-2 border border-border bg-background/90 p-2 backdrop-blur-md">
                    <a href="#top" className="flex-1 bg-secondary px-3 py-2 text-center text-sm font-medium text-foreground transition-colors hover:bg-secondary/80">
                        回到顶部
                    </a>
                    <a href="#comments-section" className="flex-1 bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
                        去评论
                    </a>
                </div>
            </div>
        </main >
    );
}
