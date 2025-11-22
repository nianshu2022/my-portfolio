"use client";

import Image from "next/image";
import { Shield } from "lucide-react";
import { useState } from "react";
import ImagePreview from "./ImagePreview";

export default function SidebarAward({ src }: { src: string }) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  
  // Split the src string by comma and trim whitespace to support multiple images
  const images = src.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <>
      <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-2xl border border-amber-200/50 dark:border-amber-700/30 backdrop-blur-md shadow-sm relative overflow-hidden group">
        {/* Decoration */}
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Shield className="w-16 h-16 text-amber-500 rotate-12" />
        </div>

        <h4 className="font-bold mb-4 text-sm text-amber-900 dark:text-amber-100 flex items-center gap-2 relative z-10">
          <span className="text-lg">🏆</span>
          获奖记录
        </h4>

        <div className={`grid ${images.length > 1 ? 'grid-cols-2 gap-3' : 'grid-cols-1'} relative z-10`}>
            {images.map((imgSrc, index) => (
                <div 
                  key={index}
                  className={`relative rounded-lg overflow-hidden shadow-md border border-amber-100 dark:border-amber-800/50 group-hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in ${images.length > 1 ? 'aspect-square' : ''}`}
                  onClick={() => setPreviewIndex(index)}
                  title="点击查看大图"
                >
                  <Image
                    src={imgSrc}
                    alt={`Award Certificate ${index + 1}`}
                    fill={images.length > 1}
                    width={images.length > 1 ? undefined : 400}
                    height={images.length > 1 ? undefined : 300}
                    className={`object-contain ${images.length === 1 ? 'w-full h-auto' : 'p-1'}`}
                    unoptimized
                  />
                   {/* Zoom hint overlay */}
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  </div>
                </div>
            ))}
        </div>

        <p className="text-xs text-amber-700/80 dark:text-amber-400 mt-3 text-center">
           {images.length > 1 ? '点击图片查看详情' : '荣获甘肃省教育厅颁发二等奖'}
        </p>
      </div>

      {previewIndex !== null && (
          <ImagePreview 
            src={images[previewIndex]} 
            alt="Award Certificate" 
            isOpen={true} 
            onClose={() => setPreviewIndex(null)} 
          />
      )}
    </>
  );
}
