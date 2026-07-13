import Link from "next/link";
import { PostSummary } from "@/lib/posts";
import { ArrowRight } from "lucide-react";

interface RelatedPostsProps {
    posts: PostSummary[];
    basePath?: string;
}

export default function RelatedPosts({ posts, basePath = "/blog" }: RelatedPostsProps) {
    if (!posts || posts.length === 0) return null;
    const isEssay = basePath === "/essays";
    const noun = isEssay ? "随笔" : "文章";

    return (
        <div className="mt-16 w-full border-t border-border pt-10">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-black text-foreground">相关{noun}</h3>
                <span className="text-sm text-muted-foreground">{posts.length} 篇</span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {posts.map((post, index) => (
                    <Link
                        key={post.slug}
                        href={`${basePath}/${post.slug}`}
                        className="group block h-full rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
                    >
                        <div className="flex flex-col h-full justify-between">
                            <div>
                                <div className="mb-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                                    <time>{post.date}</time>
                                    <span>{post.readingTime}</span>
                                </div>
                                <h4 className="mb-2 line-clamp-2 font-bold text-foreground transition-colors group-hover:text-primary">
                                    {post.title}
                                </h4>
                                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                                    {post.description}
                                </p>
                            </div>

                            <div className="mt-4 flex items-center justify-end border-t border-border pt-3 text-xs">
                                <span className="flex items-center gap-1 text-primary transition-transform group-hover:translate-x-0.5">
                                    阅读全文 <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
