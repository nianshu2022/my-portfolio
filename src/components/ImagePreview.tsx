"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ImagePreviewProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImagePreview({ src, alt, isOpen, onClose }: ImagePreviewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  // Use createPortal to render directly into document.body
  // This ensures the modal is always on top and not affected by parent transforms
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-all z-[10000] hover:rotate-90 duration-300"
      >
        <X className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Image Container */}
      <div 
        className="relative flex flex-col items-center justify-center p-4 w-full h-full max-w-7xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking image wrapper (optional, maybe clicking image should also close?)
      >
        <div className="relative shadow-2xl drop-shadow-2xl rounded-lg overflow-hidden border border-white/10 bg-zinc-900/50">
            <Image
            src={src}
            alt={alt}
            width={1600}
            height={1200}
            className="object-contain max-w-full max-h-[80vh] w-auto h-auto"
            priority
            unoptimized
            />
        </div>

        {/* Hint Text */}
        <p className="mt-6 text-zinc-400 text-sm font-light tracking-widest uppercase opacity-0 animate-in fade-in slide-in-from-bottom-4 delay-200 duration-500">
            点击任意处关闭
        </p>
      </div>
    </div>,
    document.body
  );
}
