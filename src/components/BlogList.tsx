import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { PostSummary } from "@/lib/posts";

type BlogListProps = {
  posts: PostSummary[];
};

const FALLBACK_TAG = "未分类";

// 改为 Server Component：消除不必要的 mounted hydration hack
// 此组件不依赖任何浏览器 API，不需要客户端状态
export default function BlogList({ posts }: BlogListProps) {
  return (
    <div className="max-w-4xl w-full flex flex-col gap-6">
      <div className="flex-1 space-y-8 p-6 sm:p-0 relative">
        <div className="space-y-2 text-center sm:text-left pt-0 sm:pt-4">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-flex items-center gap-3 font-serif">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            技术博客
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-serif">
            分享产品思考与技术折腾笔记。
          </p>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full mt-4"></div>
        </div>

        <div className="grid gap-6 py-4 animate-fade-in-up">
          {posts.length === 0 && (
            <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              暂无文章
            </div>
          )}

          {posts.map((post, index) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} prefetch={true}>
              <div
                className="group relative p-6 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/50 dark:border-zinc-700/50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                  <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-serif">
                    {post.title}
                  </h2>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100/50 dark:bg-zinc-800/50 px-2 py-1 rounded-full self-start sm:self-auto shrink-0 border border-zinc-200/50 dark:border-zinc-700/50">
                    {post.date}
                  </span>
                </div>

                <p className="text-zinc-600 dark:text-zinc-400 mb-4 text-sm line-clamp-2 leading-relaxed">
                  {post.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2 flex-wrap">
                    {(post.tags && post.tags.length > 0 ? post.tags : [FALLBACK_TAG]).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-0.5 bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-300 rounded-full font-medium border border-blue-100 dark:border-blue-800/30 group-hover:border-blue-200 dark:group-hover:border-blue-700/50 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-blue-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all transform translate-x-0 sm:translate-x-2 sm:group-hover:translate-x-0 flex items-center gap-1 shrink-0 ml-2 font-medium">
                    阅读全文 &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
