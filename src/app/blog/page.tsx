import FloatingNav from "@/components/FloatingNav";
import ScrollMemory from "@/components/ScrollMemory";
import BlogList from "@/components/BlogList";
import { getAllPosts } from "@/lib/posts";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative">
      <ScrollMemory />
      
      <FloatingNav backUrl="/" />

      <BlogList posts={posts} />
    </main>
  );
}
