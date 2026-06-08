"use client";

import { useState, useEffect } from "react";
import { Heart, X, Copy, Mail, Check } from "lucide-react";

export default function FriendLinkModal({ email }: { email: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [copiedTemplate, setCopiedTemplate] = useState(false);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const template = `博客名称：\n博客地址：\n博客头像：\n博客简介：`;

    const handleCopyTemplate = () => {
        navigator.clipboard.writeText(template).then(() => {
            setCopiedTemplate(true);
            setTimeout(() => setCopiedTemplate(false), 2000);
        });
    };

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent("申请友链")}&body=${encodeURIComponent("你好！我想申请交换友链，我的站点信息如下：\n\n" + template)}`;

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-400 dark:hover:text-rose-600 transition-all duration-300 cursor-pointer w-full h-full group"
            >
                <Heart className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-center">
                    <p className="font-medium text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">
                        申请友链
                    </p>
                    <p className="text-xs mt-1 text-zinc-400 dark:text-zinc-500">
                        欢迎交换链接
                    </p>
                </div>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
                    <div 
                        className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
                        {/* Close Button */}
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-500">
                                <Heart className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-serif">
                                申请友链须知
                            </h2>
                        </div>

                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                            很高兴能与你的站点互相连接！为了方便添加到列表中，请参考以下格式准备你的站点信息：
                        </p>

                        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 mb-6 border border-zinc-100 dark:border-zinc-800/50">
                            <pre className="text-sm text-zinc-700 dark:text-zinc-300 font-mono whitespace-pre-wrap">
                                {template}
                            </pre>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleCopyTemplate}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-zinc-100/80 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-medium transition-colors border border-zinc-200 dark:border-zinc-700 active:scale-[0.98]"
                            >
                                {copiedTemplate ? (
                                    <>
                                        <Check className="w-4 h-4 text-emerald-500" />
                                        <span>已复制模板</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 text-zinc-500" />
                                        <span>复制申请格式</span>
                                    </>
                                )}
                            </button>

                            <a
                                href={mailtoLink}
                                onClick={() => setIsOpen(false)}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 transition-all hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
                            >
                                <Mail className="w-4 h-4" />
                                <span>通过邮件发送</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
