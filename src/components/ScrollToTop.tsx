"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
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

  return (
    <div 
      className={`fixed bottom-8 right-8 xl:right-[calc(50%-42rem)] z-50 print:hidden transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
      }`}
    >
      <Button
        onClick={scrollToTop}
        size="icon"
        className="rounded-full w-12 h-12 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-700 dark:text-zinc-200 shadow-xl shadow-zinc-200/20 dark:shadow-black/40 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 hover:dark:bg-zinc-800 hover:scale-110 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-8 w-8" />
      </Button>
    </div>
  );
}
