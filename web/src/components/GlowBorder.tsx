"use client";

import type { ReactNode } from "react";

interface GlowBorderProps {
  children: ReactNode;
  className?: string;
}

export default function GlowBorder({ children, className }: GlowBorderProps) {
  return (
    <div className={`group relative ${className ?? ""}`}>
      <div
        className="absolute -inset-[1px] rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(34,211,238,0.2), rgba(168,85,247,0.3))",
          backgroundSize: "200% 200%",
          animation: "gradient-shift 4s linear infinite",
          filter: "blur(4px)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
