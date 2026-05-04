import FloatingNav from "@/components/FloatingNav";
import ScrollMemory from "@/components/ScrollMemory";
import ContentList from "@/components/ContentList";
import { getAllEssaySummaries } from "@/lib/posts";

export default function EssaysPage() {
  const posts = getAllEssaySummaries();

  return (
    <main className="garden-shell">
      <ScrollMemory />
      <FloatingNav backUrl="/" />
      <ContentList posts={posts} type="essay" />
    </main>
  );
}
