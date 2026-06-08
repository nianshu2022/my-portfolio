"use client";

import { useEffect, useState, useCallback } from "react";

export default function MouseGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    });
  }, [visible]);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouchDevice || prefersReducedMotion) return;

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const isTouchDevice = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isTouchDevice || prefersReducedMotion) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-500"
      style={{
        opacity: visible ? 1 : 0,
        background: `radial-gradient(520px circle at ${position.x}px ${position.y}px, rgba(180,35,42,0.045), transparent 42%)`,
        willChange: "background",
      }}
    />
  );
}
