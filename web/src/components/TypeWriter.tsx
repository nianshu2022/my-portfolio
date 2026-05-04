"use client";

import { useEffect, useState } from "react";

interface TypeWriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}

export default function TypeWriter({
  text,
  speed = 60,
  delay = 300,
  className,
}: TypeWriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          setTimeout(() => setShowCursor(false), 3000);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return (
    <h1 className={className}>
      {displayText}
      {showCursor && (
        <span
          className={isComplete ? "animate-cursor-blink" : "animate-cursor-blink"}
          style={{ color: "var(--primary)", fontWeight: 300 }}
        >
          |
        </span>
      )}
    </h1>
  );
}
