import { getEssayBySlug, getAllEssays } from "@/lib/posts";
import { Metadata } from "next";
import Markdown from "react-markdown";
import { BookOpen, Clock, Eye } from "lucide-react";
import { notFound } from "next/navigation";
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import BusuanziCounter from "@/components/Busuanzi";
import ReadingProgress from "@/components/ReadingProgress";
import SidebarAward from "@/components/SidebarAward";
import FloatingNav from "@/components/FloatingNav";
import DonateButton from "@/components/DonateButton";
import CodeBlock from "@/components/ui/CodeBlock";
import Comments from "@/components/Comments";
import ScrollMemory from "@/components/ScrollMemory";
import FontSizeControl from "@/components/FontSizeControl";
import ShareButton from "@/components/ShareButton";
import LikeButton from "@/components/LikeButton";
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

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

    // Custom schema for rehype-sanitize
    const sanitizeSchema = {
        ...defaultSchema,
        tagNames: [
            ...(defaultSchema.tagNames || []),
            'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'br', 'hr', 'span', 'div'
        ],
        attributes: {
            ...defaultSchema.attributes,
            'img': ['src', 'alt', 'title', 'width', 'height', 'style', 'className'],
            '*': ['className', 'id', 'style']
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-4 sm:p-24 relative font-serif overflow-hidden">
            <ScrollMemory />
            {/* Background Blobs (Purple/Pink Theme) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
                <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] bg-pink-200/30 dark:bg-pink-900/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-fuchsia-200/30 dark:bg-fuchsia-900/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
            </div>
            <ReadingProgress />

            <FloatingNav backUrl="/essays" />

            <div className="max-w-3xl w-full flex flex-col relative overflow-hidden">

                {/* Cover Image - Floating with shadow */}
                {post.cover && (
                    <div className="w-full h-64 sm:h-96 relative mb-12 rounded-3xl overflow-hidden shadow-2xl">
                        <img
                            src={post.cover}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                )}

                <article className="w-full pb-12 px-2 sm:px-0">
                    <header className="mb-12 text-center">
                        <h1 className="text-4xl sm:text-6xl font-bold mb-8 text-zinc-900 dark:text-zinc-50 leading-tight tracking-tight font-serif drop-shadow-sm">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap justify-center items-center gap-4 text-zinc-500 text-sm font-sans mb-8">
                            <div className="flex items-center gap-2">
                                <span className="font-mono">{post.date}</span>
                            </div>

                            <span className="text-zinc-300">|</span>

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

                        {/* Decorative Separator */}
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-px w-24 bg-gradient-to-r from-transparent via-purple-300 to-transparent dark:via-purple-800"></div>
                            <div className="w-2 h-2 rounded-full bg-purple-400 dark:bg-purple-600"></div>
                            <div className="h-px w-24 bg-gradient-to-r from-transparent via-purple-300 to-transparent dark:via-purple-800"></div>
                        </div>
                    </header>

                    <div className="essay-content prose prose-lg prose-zinc dark:prose-invert max-w-none prose-p:indent-0 prose-p:text-justify prose-headings:font-serif prose-headings:text-center prose-img:rounded-xl prose-img:shadow-lg prose-a:break-all prose-img:mx-auto" style={{ fontSize: 'var(--article-font-size, 17px)' }}>
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
                                    let className = "rounded-lg block mx-auto";

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
                                            className += " mb-6 sm:inline-block sm:mx-0 sm:mb-4 sm:mr-8";
                                        }

                                        if (shadow === 'true' || shadow === '1') {
                                            style.filter = 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))';
                                        }

                                        // Image Proxy Logic (wsrv.nl)
                                        if (src.startsWith('http')) {
                                            try {
                                                const imageUrl = new URL(src);
                                                // Avoid double proxying and skip local images
                                                if (!imageUrl.hostname.includes('wsrv.nl') &&
                                                    !imageUrl.hostname.includes('nianshu2022.cn')) {
                                                    imageSrc = `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=1200&q=85&output=webp`;
                                                }
                                            } catch { }
                                        }
                                    } catch { }

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

                    {/* Award Display - Centered for essays */}
                    {post.award && (
                        <div className="mt-16 flex justify-center">
                            <div className="max-w-sm w-full transform hover:scale-105 transition-transform duration-500">
                                <SidebarAward src={post.award} />
                            </div>
                        </div>
                    )}

                    <div className="mt-20 pt-10 border-t border-zinc-200/50 dark:border-zinc-700/50">
                        {/* Simplified Copyright Section - Minimalist */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4 text-sm text-zinc-400 font-serif">
                            <div className="flex flex-col gap-2 text-center sm:text-left">
                                <p>
                                    <span className="font-semibold text-zinc-500 dark:text-zinc-300">© 念舒</span>
                                    <span className="mx-2">·</span>
                                    <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors">CC BY-NC-SA 4.0</a>
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

                        <div className="text-center mt-12 mb-8">
                            <span className="text-3xl text-zinc-200 dark:text-zinc-800 select-none">❦</span>
                        </div>

                        <Comments />
                    </div>
                </article>
            </div>
        </main>
    );
}

