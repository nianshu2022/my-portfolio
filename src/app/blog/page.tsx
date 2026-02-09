import FloatingNav from "@/components/FloatingNav";
import ScrollMemory from "@/components/ScrollMemory";
import BlogList from "@/components/BlogList";
import { getAllPostSummaries } from "@/lib/posts";



export default function BlogPage() {
  const posts = getAllPostSummaries();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative overflow-hidden">

      {/* Background Blobs (Blue/Violet Theme) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-violet-200/30 dark:bg-violet-900/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
      </div>

      <ScrollMemory />

      <FloatingNav backUrl="/" />

      <BlogList posts={posts} />
    </main>
  );
}
