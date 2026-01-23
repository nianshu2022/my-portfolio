import Link from "next/link";
import { PostSummary } from "@/lib/posts";
import { ArrowRight } from "lucide-react";

interface RelatedPostsProps {
    posts: PostSummary[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="w-full mt-16 border-t border-zinc-200/50 dark:border-zinc-700/50 pt-10">
            <h3 className="text-xl font-bold mb-8 text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                相关推荐
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group block h-full bg-zinc-50/50 dark:bg-zinc-800/30 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-700/50 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex flex-col h-full justify-between">
                            <div>
                                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {post.title}
                                </h4>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4">
                                    {post.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between text-xs text-zinc-400 mt-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-700/50">
                                <span>{post.date}</span>
                                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-blue-500">
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
