"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, Sparkles, Copy, Check, RotateCcw, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
    role: "user" | "assistant";
    content: string;
};

const INITIAL_MESSAGE: Message = {
    role: "assistant",
    content: "你好！我是念舒的 AI 助手。我已经阅读了博客的所有文章，你想了解什么？",
};

const SUGGESTED_QUESTIONS = [
    "你写过哪些关于前端技术的文章？",
    "博客最近更新了什么内容？",
    "你对 AI 开发有什么看法？",
];

function getErrorMessage(status?: number): string {
    if (status === 429) return "发送太频繁，请稍后再试 🙏";
    if (status === 504) return "AI 响应超时，请重试 ⏱️";
    return "遇到了点问题，请稍后再试 😅";
}

export default function AIChatButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    // 自动滚到底部
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    // Textarea 自动扩高（最多 4 行）
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 96)}px`; // ~4行
    }, [input]);

    const sendMessage = useCallback(async (text: string) => {
        const userMessage = text.trim();
        if (!userMessage || isLoading) return;

        const nextMessages: Message[] = [...messages, { role: "user", content: userMessage }];
        setMessages(nextMessages);
        setInput("");
        setIsLoading(true);

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: nextMessages }),
                signal: controller.signal,
            });

            if (!response.ok) {
                setMessages(prev => [
                    ...prev,
                    { role: "assistant", content: getErrorMessage(response.status) },
                ]);
                return;
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) return;

            // 添加占位消息
            setMessages(prev => [...prev, { role: "assistant", content: "" }]);

            const streamBufferRef = { current: "" };
            let rafId: number | null = null;

            const flush = () => {
                const buffered = streamBufferRef.current;
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        ...updated[updated.length - 1],
                        content: buffered,
                    };
                    return updated;
                });
                rafId = null;
            };

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                if (chunk) {
                    streamBufferRef.current += chunk;
                    if (rafId === null) {
                        rafId = requestAnimationFrame(flush);
                    }
                }
            }

            if (rafId !== null) cancelAnimationFrame(rafId);
            flush();
        } catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
                // 用户主动停止，保留已生成内容，不额外追加错误消息
                return;
            }
            console.error(error);
            setMessages(prev => [
                ...prev,
                { role: "assistant", content: getErrorMessage() },
            ]);
        } finally {
            setIsLoading(false);
            abortRef.current = null;
        }
    }, [isLoading, messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await sendMessage(input);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const handleStop = () => {
        abortRef.current?.abort();
    };

    const handleClear = () => {
        setMessages([INITIAL_MESSAGE]);
    };

    const hasHistory = messages.length > 1;

    return (
        <>
            {/* 悬浮按钮 */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group animate-breathing hover:animate-none"
                >
                    <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                </button>
            )}

            {/* 聊天窗口 */}
            <div
                className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 flex flex-col w-auto sm:w-[400px] h-[60vh] sm:h-[520px] sm:max-h-[80vh] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl transition-all duration-300 origin-bottom-right ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 rounded-t-2xl shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-1.5 rounded-lg">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">AI 助手</h3>
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                <span className="text-[10px] text-zinc-500">Online</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {/* 清空对话 */}
                        {hasHistory && (
                            <button
                                onClick={handleClear}
                                title="清空对话"
                                className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <X className="w-5 h-5 text-zinc-500" />
                        </button>
                    </div>
                </div>

                {/* 消息列表 */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar min-h-0">
                    {messages.map((msg, idx) => (
                        <MessageBubble key={idx} msg={msg} idx={idx} />
                    ))}

                    {/* 快捷问题气泡（仅在初始状态显示） */}
                    {!hasHistory && !isLoading && (
                        <div className="flex flex-wrap gap-2 pt-1">
                            {SUGGESTED_QUESTIONS.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => sendMessage(q)}
                                    className="text-xs px-3 py-1.5 rounded-full border border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors text-left"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 加载点动画 */}
                    {isLoading && messages[messages.length - 1]?.content === "" && (
                        <div className="flex justify-start">
                            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-3 rounded-bl-none flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 输入区 */}
                <form onSubmit={handleSubmit} className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 rounded-b-2xl shrink-0">
                    <div className="relative flex items-end gap-2">
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="问点什么… (Enter 发送，Shift+Enter 换行)"
                            disabled={isLoading}
                            className="w-full resize-none bg-zinc-100 dark:bg-zinc-800 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 disabled:opacity-60 overflow-hidden leading-relaxed"
                            style={{ minHeight: "44px", maxHeight: "96px" }}
                        />
                        {isLoading ? (
                            /* 停止按钮 */
                            <button
                                type="button"
                                onClick={handleStop}
                                className="absolute right-2 bottom-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-all shadow-sm"
                                title="停止生成"
                            >
                                <Square className="w-4 h-4 fill-white" />
                            </button>
                        ) : (
                            /* 发送按钮 */
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="absolute right-2 bottom-2 p-1.5 bg-white dark:bg-zinc-700 rounded-lg text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <div className="text-[10px] text-center text-zinc-400 mt-2">
                        Powered by DeepSeek &amp; Next.js
                    </div>
                </form>
            </div>
        </>
    );
}

function MessageBubble({ msg, idx }: { msg: Message; idx: number }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(msg.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
                className={`group relative max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                        ? "bg-violet-600 text-white rounded-br-none"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none shadow-sm"
                }`}
            >
                {msg.role === "assistant" && idx === 0 && (
                    <Sparkles className="w-3 h-3 text-amber-500 inline mr-1" />
                )}

                <div
                    className={`prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-800 prose-pre:text-zinc-100 ${
                        msg.role === "user" ? "prose-invert text-white" : "dark:prose-invert"
                    }`}
                >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                    </ReactMarkdown>
                </div>

                {/* 复制按钮 */}
                {msg.content && (
                    <button
                        onClick={handleCopy}
                        className={`absolute ${
                            msg.role === "user"
                                ? "left-0 -translate-x-full pr-2"
                                : "right-0 translate-x-full pl-2"
                        } top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300`}
                        title="复制内容"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-500" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
