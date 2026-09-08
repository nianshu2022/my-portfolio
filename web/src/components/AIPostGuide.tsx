"use client";

import { useState } from "react";
import { Bot, ChevronDown, ChevronUp, Sparkles, CheckCircle2, GitCommit } from "lucide-react";

export type AIPostMeta = {
  tldr: string;
  keyTakeaways: string[];
  mermaid?: string;
};

interface AIPostGuideProps {
  meta?: AIPostMeta | null;
}

export default function AIPostGuide({ meta }: AIPostGuideProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showMermaid, setShowMermaid] = useState(false);

  if (!meta || (!meta.tldr && (!meta.keyTakeaways || meta.keyTakeaways.length === 0))) {
    return null;
  }

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 via-card/50 to-card p-5 shadow-sm backdrop-blur-sm transition-all dark:border-primary/30 dark:from-primary/10">
      {/* 头部标题与折叠按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-foreground sm:text-base">
                念舒 AI 极客导读
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                <Sparkles className="h-3 w-3" />
                TL;DR
              </span>
            </div>
            <p className="text-xs text-muted-foreground">基于 SiliconFlow Qwen2.5 快速提炼</p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
          aria-label={isOpen ? "折叠导读" : "展开导读"}
        >
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* 主体内容 */}
      {isOpen && (
        <div className="mt-4 space-y-4 pt-3 border-t border-border/40 text-sm">
          {/* TL;DR 极速概述 */}
          {meta.tldr && (
            <div className="rounded-xl bg-background/60 p-3.5 border border-border/50 text-foreground/90 leading-relaxed">
              <span className="font-semibold text-primary mr-1.5">核心结论:</span>
              {meta.tldr}
            </div>
          )}

          {/* 3 条关键要点 */}
          {meta.keyTakeaways && meta.keyTakeaways.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                30 秒读懂本篇要点：
              </span>
              <ul className="grid gap-2">
                {meta.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-muted-foreground text-xs sm:text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span className="leading-snug text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mermaid 流程图代码折叠 */}
          {meta.mermaid && (
            <div className="pt-2">
              <button
                onClick={() => setShowMermaid(!showMermaid)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                <GitCommit className="h-3.5 w-3.5" />
                {showMermaid ? "隐藏排障/架构链路" : "查看排障/架构思维链路"}
              </button>

              {showMermaid && (
                <div className="mt-2 rounded-xl bg-zinc-950 p-4 text-xs font-mono text-zinc-200 overflow-x-auto border border-zinc-800">
                  <pre className="whitespace-pre">{meta.mermaid}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
