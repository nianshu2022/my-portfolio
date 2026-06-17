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
    <div className="fixed left-4 top-20 z-50 transition-all duration-300">
      <Button
        variant="secondary"
        size="icon"
        className="h-10 w-10 border border-border bg-card/90 text-foreground shadow-sm backdrop-blur-xl hover:border-primary hover:bg-secondary"
        title="返回列表"
        onClick={() => router.push(backUrl)}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
    </div>
  );
}
