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
    const noun = isEssay ? "样本" : "案卷";

    return (
        <div className="mt-16 w-full border-t border-border pt-10">
            <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                    <p className="font-mono text-xs font-bold text-primary">RELATED FILES</p>
                    <h3 className="mt-2 text-2xl font-black text-foreground">相关{noun}</h3>
                </div>
                <span className="hidden border border-primary px-2 py-1 font-mono text-xs text-primary sm:inline">
                    {String(posts.length).padStart(2, "0")} 份
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {posts.map((post, index) => (
                    <Link
                        key={post.slug}
                        href={`${basePath}/${post.slug}`}
                        className="group block h-full border border-foreground/40 bg-card/80 p-5 transition-colors hover:bg-secondary"
                    >
                        <div className="flex flex-col h-full justify-between">
                            <div>
                                <div className="mb-3 flex items-center justify-between gap-3 font-mono text-xs text-muted-foreground">
                                    <span>{String(index + 1).padStart(3, "0")}</span>
                                    <span>{post.date}</span>
                                </div>
                                <h4 className="mb-2 line-clamp-2 font-bold text-foreground transition-colors group-hover:text-primary">
                                    {post.title}
                                </h4>
                                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                                    {post.description}
                                </p>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs">
                                <span className="text-muted-foreground">{post.readingTime}</span>
                                <span className="flex items-center gap-1 text-primary transition-transform group-hover:translate-x-1">
                                    查阅 <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
