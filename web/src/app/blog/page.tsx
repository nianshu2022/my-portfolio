import FloatingNav from "@/components/FloatingNav";
import ScrollMemory from "@/components/ScrollMemory";
import ContentList from "@/components/ContentList";
import { getAllPostSummaries } from "@/lib/posts";

export default function BlogPage() {
  const posts = getAllPostSummaries();

  return (
    <main className="garden-shell">
      <ScrollMemory />
      <FloatingNav backUrl="/" />
      <ContentList posts={posts} type="post" />
    </main>
  );
}
