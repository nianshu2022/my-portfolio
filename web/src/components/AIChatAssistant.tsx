"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, ExternalLink, ChevronDown, ChevronRight, RotateCcw, Terminal } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  references?: Array<{ title: string; url: string }>;
  isStreaming?: boolean;
}

const QUICK_QUESTIONS = [
  "怎么清理 Docker 几十G的垃圾文件？",
  "Cloudflare Zero Trust 是如何保护 Homelab 的？",
  "念舒参加华为 ICT 国赛的经历和感悟？",
  "手机上怎么离线跑通 Gemma 4 大模型？",
];

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "你好！我是念舒的 **AI 数字分身**。我熟悉念舒折腾过的所有技术文章、排障手记和成长随笔。\n\n你可以向我询问关于 Linux 运维、Homelab、本地大模型部署、或者念舒的竞赛经历等任何问题！",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showThinking, setShowThinking] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const toggleThinking = (id: string) => {
    setShowThinking((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input.trim();
    if (!textToSend || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `assistant-${Date.now()}`;

    const newMessages: Message[] = [
      ...messages,
      { id: userMsgId, role: "user", content: textToSend },
      { id: assistantMsgId, role: "assistant", content: "", reasoning: "", isStreaming: true },
    ];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages
            .filter((m) => m.id !== "welcome" && m.id !== assistantMsgId)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.statusText}`);
      }

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedContent = "";
      let accumulatedReasoning = "";
      let references: Array<{ title: string; url: string }> = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === "data: [DONE]") continue;

          if (trimmed.startsWith("data: ")) {
            const jsonStr = trimmed.slice(6);
            try {
              const data = JSON.parse(jsonStr);

              // 接收引用文章
              if (data.references) {
                references = data.references;
              }

              // 接收流式生成片段
              const delta = data.choices?.[0]?.delta;
              if (delta) {
                if (delta.reasoning_content) {
                  accumulatedReasoning += delta.reasoning_content;
                }
                if (delta.content) {
                  accumulatedContent += delta.content;
                }
              }

              // 实时更新当前助手消息
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId
                    ? {
                        ...msg,
                        content: accumulatedContent,
                        reasoning: accumulatedReasoning,
                        references: references.length > 0 ? references : msg.references,
                      }
                    : msg
                )
              );
            } catch {
              // 忽略非完整 JSON 行
            }
          }
        }
      }

      // 标记流结束
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg
        )
      );
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content: `❌ 出错了：${err.message || "服务暂时不可达，请稍后重试"}`,
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "会话已清空。有什么想了解的技术问题，随时告诉我！",
      },
    ]);
  };

  return (
    <>
      {/* 悬浮唤起按钮 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-primary to-violet-600 px-4 py-3 text-white shadow-xl shadow-primary/25 transition-all hover:scale-105 active:scale-95 group"
          aria-label="打开念舒 AI 问答"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <Bot className="h-5 w-5 transition-transform group-hover:rotate-12" />
          <span className="text-sm font-semibold tracking-wide pr-1">问问念舒 AI</span>
        </button>
      )}

      {/* 对话窗口 */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[580px] w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-hidden rounded-3xl border border-border/80 bg-background/95 shadow-2xl backdrop-blur-2xl transition-all sm:bottom-6 sm:right-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-white shadow-sm">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-foreground">念舒 AI 分身</h3>
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Terminal className="h-3 w-3" />
                  DeepSeek-R1 · BGE-M3 RAG
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="清空聊天"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="关闭"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 消息历史 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted/70 text-foreground rounded-tl-none border border-border/40"
                  }`}
                >
                  {/* DeepSeek-R1 思考链展示 */}
                  {msg.reasoning && (
                    <div className="mb-2.5 rounded-xl border border-primary/20 bg-primary/5 p-2.5 text-xs text-muted-foreground">
                      <button
                        onClick={() => toggleThinking(msg.id)}
                        className="flex w-full items-center justify-between font-mono font-medium text-primary hover:underline"
                      >
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          {msg.isStreaming && !msg.content ? "深度思考中..." : "深度思考过程"}
                        </span>
                        {showThinking[msg.id] ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )}
                      </button>
                      {showThinking[msg.id] && (
                        <div className="mt-2 max-h-36 overflow-y-auto whitespace-pre-wrap border-t border-border/30 pt-2 font-mono text-[11px] opacity-80">
                          {msg.reasoning}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 正式回复内容 */}
                  <div className="whitespace-pre-wrap">
                    {msg.content || (msg.isStreaming ? "正在思考与组织语言..." : "")}
                  </div>

                  {/* 关联引用文章卡片 */}
                  {msg.references && msg.references.length > 0 && (
                    <div className="mt-3 border-t border-border/50 pt-2.5">
                      <span className="text-[11px] font-semibold text-muted-foreground block mb-1">
                        📖 参考博客文章：
                      </span>
                      <div className="flex flex-col gap-1">
                        {msg.references.map((ref, i) => (
                          <Link
                            key={i}
                            href={ref.url}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {ref.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 快捷推荐提问（当只有一条消息时显示） */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <span className="text-[11px] font-medium text-muted-foreground block mb-1.5">
                💡 试试这样问我：
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-xs text-foreground/80 hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 输入框 */}
          <div className="border-t border-border/60 bg-muted/20 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isLoading ? "AI 思考回复中..." : "输入你想询问的问题..."}
                disabled={isLoading}
                className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
                aria-label="发送消息"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
