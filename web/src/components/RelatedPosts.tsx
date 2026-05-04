import Link from "next/link";
import { PostSummary } from "@/lib/posts";
import { ArrowRight } from "lucide-react";

interface RelatedPostsProps {
    posts: PostSummary[];
    basePath?: string;
}

export default function RelatedPosts({ posts, basePath = "/blog" }: RelatedPostsProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="mt-16 w-full border-t border-border pt-10">
            <h3 className="mb-8 flex items-center gap-2 text-xl font-bold text-foreground">
                <span className="h-6 w-1 rounded-full bg-primary"></span>
                相关推荐
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`${basePath}/${post.slug}`}
                        className="garden-panel group block h-full p-5 transition-colors hover:bg-secondary"
                    >
                        <div className="flex flex-col h-full justify-between">
                            <div>
                                <div className="mb-2 text-xs text-muted-foreground">{post.date}</div>
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
                                    阅读 <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
