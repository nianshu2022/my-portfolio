"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!mounted) return null;

  return (
    <div
      className={`fixed bottom-24 xl:bottom-8 right-8 xl:right-[calc(50%-42rem)] z-50 print:hidden transition-all duration-500 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
        }`}
    >
      <Button
        onClick={scrollToTop}
        size="icon"
        className="rounded-full w-12 h-12 bg-card/60 backdrop-blur-xl text-foreground shadow-xl shadow-black/20 border border-border/30 hover:bg-secondary hover:scale-110 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-8 w-8" />
      </Button>
    </div>
  );
}
