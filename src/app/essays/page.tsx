import FloatingNav from "@/components/FloatingNav";
import ScrollMemory from "@/components/ScrollMemory";
import EssayList from "@/components/EssayList";
import { getAllEssaySummaries } from "@/lib/posts";

export default function EssaysPage() {
  const posts = getAllEssaySummaries();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative">
      <ScrollMemory />

      <FloatingNav backUrl="/" />

      <EssayList posts={posts} />
    </main>
  );
}

