"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface FloatingNavProps {
  backUrl?: string;
}

export default function FloatingNav({ backUrl = "/blog" }: FloatingNavProps) {
  const router = useRouter();

  return (
    <div className="fixed bottom-16 left-4 z-50 transition-all duration-300 md:bottom-4 xl:bottom-auto xl:top-20 xl:left-[calc(50%-39rem)]">
      <Button
        variant="secondary"
        size="icon"
        className="h-10 w-10 rounded-md border border-border/30 bg-card/60 backdrop-blur-xl text-foreground shadow-sm hover:bg-secondary hover:border-primary/30"
        title="返回列表"
        onClick={() => router.push(backUrl)}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
    </div>
  );
}

