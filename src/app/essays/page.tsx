import FloatingNav from "@/components/FloatingNav";
import ScrollMemory from "@/components/ScrollMemory";
import EssayList from "@/components/EssayList";
import { getAllEssaySummaries } from "@/lib/posts";

export default function EssaysPage() {
  const posts = getAllEssaySummaries();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative overflow-hidden">

      {/* Background Blobs (Purple/Pink Theme) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
        <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] bg-pink-200/30 dark:bg-pink-900/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-fuchsia-200/30 dark:bg-fuchsia-900/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
      </div>

      <ScrollMemory />

      <FloatingNav backUrl="/" />

      <EssayList posts={posts} />
    </main>
  );
}

