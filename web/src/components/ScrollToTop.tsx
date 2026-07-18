"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
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
      className={`fixed bottom-24 xl:bottom-8 right-8 xl:right-[calc(50%-42rem)] z-50 print:hidden transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-card/80 text-foreground shadow-md backdrop-blur-xl transition-all duration-300 hover:border-primary hover:bg-secondary hover:shadow-lg hover:shadow-primary/20"
        style={{ animation: "pulse-ring 2.2s ease-in-out infinite" }}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:animate-[arrow-bounce_0.9s_ease-in-out_infinite]" />
      </button>
    </div>
  );
}
