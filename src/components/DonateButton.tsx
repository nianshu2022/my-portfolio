"use client";

import { useState } from "react";
import { Coffee, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createPortal } from "react-dom";

export default function DonateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // ALIPAY_URL: urlencoded alipay qr code string.
  // In a real scenario, you would replace these with your actual image paths or payment links
  const ALIPAY_IMG = "/img/alipay.jpg"; 
  const WECHAT_IMG = "/img/wechat.jpg";

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="gap-2 rounded-full border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/20"
      >
        <Coffee className="w-4 h-4" />
        <span>请我喝杯咖啡</span>
      </Button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-4">
                  <Coffee className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  感谢支持
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
                  如果觉得文章对你有帮助，欢迎请我喝杯咖啡 ☕️
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {/* WeChat Pay */}
                  <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#2DB16D]/5 border border-[#2DB16D]/20">
                    <div className="relative w-32 h-32 bg-white p-2 rounded-lg shadow-sm">
                      {/* Placeholder for WeChat QR Code */}
                      <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-xs text-zinc-400">
                         <Image src={WECHAT_IMG} alt="WeChat Pay" width={120} height={120} className="w-full h-full object-contain" unoptimized />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[#2DB16D]">微信支付</span>
                  </div>

                  {/* Alipay */}
                  <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#1677FF]/5 border border-[#1677FF]/20">
                    <div className="relative w-32 h-32 bg-white p-2 rounded-lg shadow-sm">
                      {/* Placeholder for Alipay QR Code */}
                       <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-xs text-zinc-400">
                         <Image src={ALIPAY_IMG} alt="Alipay" width={120} height={120} className="w-full h-full object-contain" unoptimized />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[#1677FF]">支付宝</span>
                  </div>
                </div>
                
                <div className="mt-8 text-xs text-zinc-400">
                    <p>赞赏仅作为对作者的鼓励，不构成任何服务承诺。</p>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

