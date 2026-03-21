"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Sparkles, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function AIChatButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "你好！我是念舒的 AI 助手。我已经阅读了博客的所有文章，你想了解什么？" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    // 用于暂存流式内容，避免每个 chunk 都触发 setMessages
    const streamBufferRef = useRef("");

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, { role: "user", content: userMessage }]
                })
            });

            if (!response.ok) throw new Error("Network response was not ok");

            // Handle Stream
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) return;

            setMessages(prev => [...prev, { role: "assistant", content: "" }]);
            streamBufferRef.current = "";

            let rafId: number | null = null;

            // 用 RAF 批量 flush 缓冲区到 state，减少 re-render 次数
            const flush = () => {
                const buffered = streamBufferRef.current;
                setMessages(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1].content = buffered;
                    return newHistory;
                });
                rafId = null;
            };

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                if (chunk) {
                    streamBufferRef.current += chunk;
                    // 仅在没有待处理的 RAF 时才调度
                    if (rafId === null) {
                        rafId = requestAnimationFrame(flush);
                    }
                }
            }
            // 确保最后的内容被 flush
            if (rafId !== null) cancelAnimationFrame(rafId);
            flush();

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "assistant", content: "抱歉，由于网络原因我暂时无法回答，请稍后再试。" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Initial Floating Button */}
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

            {/* Chat Window */}
            <div className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 flex flex-col w-auto sm:w-[400px] h-[60vh] sm:h-[500px] sm:max-h-[80vh] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl transition-all duration-300 origin-bottom-right ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 rounded-t-2xl">
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
                    <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <X className="w-5 h-5 text-zinc-500" />
                    </button>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {messages.map((msg, idx) => (
                        <MessageBubble
                            key={idx}
                            msg={msg}
                            idx={idx}
                            isLast={idx === messages.length - 1}
                        />
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-3 rounded-bl-none flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 rounded-b-2xl">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="搜索博客内容..."
                            className="w-full bg-zinc-100 dark:bg-zinc-800 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 p-1.5 bg-white dark:bg-zinc-700 rounded-lg text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-[10px] text-center text-zinc-400 mt-2">
                        Powered by DeepSeek & Next.js
                    </div>
                </form>
            </div>
        </>
    );
}

function MessageBubble({ msg, idx, isLast }: { msg: Message; idx: number; isLast: boolean }) {
    const [copied, setCopied] = useState(false);
    // Initialize displayed text: 
    // If it's the assistant's message and it's the last one, start empty to type it out.
    // Otherwise show full content immediately (history).
    const [displayedContent, setDisplayedContent] = useState(
        (msg.role === "assistant" && isLast) ? "" : msg.content
    );

    // If msg.content updates (streaming), we need to ensure the typing effect continues/starts
    // independent of the initial state.
    useEffect(() => {
        if (msg.role !== "assistant") {
            setDisplayedContent(msg.content);
            return;
        }

        // If we are already caught up (or this is a history message that started full), just keep in sync
        // But for the specific case of "typewriter", we essentially want:
        // IF displayedContent < msg.content, schedule append.

        if (displayedContent.length < msg.content.length) {
            const timeoutId = setTimeout(() => {
                setDisplayedContent(msg.content.slice(0, displayedContent.length + 1));
            }, 20); // Typing speed: 20ms per char
            return () => clearTimeout(timeoutId);
        }
    }, [msg.content, displayedContent, msg.role]);

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
            <div className={`group relative max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user"
                ? "bg-violet-600 text-white rounded-br-none"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none shadow-sm"
                }`}>
                {msg.role === "assistant" && idx === 0 && (
                    <Sparkles className="w-3 h-3 text-amber-500 inline mr-1" />
                )}

                <div className={`prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-800 prose-pre:text-zinc-100 ${msg.role === "user" ? "prose-invert text-white" : "dark:prose-invert"
                    }`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {displayedContent}
                    </ReactMarkdown>
                </div>

                {/* Copy Button */}
                <button
                    onClick={handleCopy}
                    className={`absolute ${msg.role === "user" ? "left-0 -translate-x-full pr-2" : "right-0 translate-x-full pl-2"
                        } top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300`}
                    title="复制内容"
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                    ) : (
                        <Copy className="w-4 h-4" />
                    )}
                </button>
            </div>
        </div>
    );
}
