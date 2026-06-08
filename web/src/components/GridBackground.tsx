"use client";

import { useEffect, useState } from "react";

export default function GridBackground() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (!isDark) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 animate-glow-pulse"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,90,79,0.055) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
  );
}
