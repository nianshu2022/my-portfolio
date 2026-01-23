import FloatingNav from "@/components/FloatingNav";
import ScrollMemory from "@/components/ScrollMemory";
import BlogList from "@/components/BlogList";
import { getAllPostSummaries } from "@/lib/posts";

import Search from "@/components/Search";

export default function BlogPage() {
  const posts = getAllPostSummaries();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative">
      <ScrollMemory />

      <FloatingNav backUrl="/" />

      <div className="w-full max-w-2xl z-20 mb-8 sticky top-24">
        <Search posts={posts} />
      </div>

      <BlogList posts={posts} />
    </main>
  );
}
