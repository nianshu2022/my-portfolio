"use client";

import { useEffect, useState } from "react";
import { Calendar, CheckCircle2, FileText, Loader2, Reply, Trash2, User, XCircle } from "lucide-react";
import { analyzeSuspiciousText, compactUntrustedText } from "@/lib/admin-security";

type Comment = {
  id: number;
  slug: string;
  nickname: string;
  content: string;
  created_at: string;
  post_title: string;
  reply_content: string | null;
};

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyId, setReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [riskFilter, setRiskFilter] = useState<"all" | "risk">("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const fetchComments = async () => {
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/admin/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data.results || data);
      }
    } catch (err) {
      console.error("Fetch comments error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这条评论吗？此操作不可撤销。")) return;

    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/admin/comments/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setComments(comments.filter((comment) => comment.id !== id));
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        showMsg("success", "评论已删除");
      }
    } catch {
      showMsg("error", "删除失败");
    }
  };

  const handleReply = async (id: number) => {
    if (!replyText.trim()) return;

    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/admin/comments/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, reply_content: replyText }),
      });
      if (res.ok) {
        setComments(comments.map((comment) => comment.id === id ? { ...comment, reply_content: replyText } : comment));
        setReplyId(null);
        setReplyText("");
        showMsg("success", "已回复评论");
      }
    } catch {
      showMsg("error", "回复失败");
    }
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
        <p className="font-mono text-xs font-bold">调取评论记录</p>
      </div>
    );
  }

  const commentsWithRisk = comments.map((comment) => ({
    comment,
    risk: analyzeSuspiciousText(comment.nickname, comment.content, comment.slug, comment.post_title, comment.reply_content),
  }));
  const riskyCount = commentsWithRisk.filter((item) => item.risk.flagged).length;
  const visibleComments = riskFilter === "risk" ? commentsWithRisk.filter((item) => item.risk.flagged) : commentsWithRisk;
  const visibleRiskIds = visibleComments.filter((item) => item.risk.flagged).map((item) => item.comment.id);
  const selectedVisibleRiskIds = visibleRiskIds.filter((id) => selectedIds.includes(id));
  const hasSelectedAllVisibleRisk = visibleRiskIds.length > 0 && selectedVisibleRiskIds.length === visibleRiskIds.length;

  const toggleSelect = (id: number) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]);
  };

  const toggleSelectVisibleRisk = () => {
    if (hasSelectedAllVisibleRisk) {
      setSelectedIds((current) => current.filter((id) => !visibleRiskIds.includes(id)));
      return;
    }
    setSelectedIds((current) => Array.from(new Set([...current, ...visibleRiskIds])));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`确定删除选中的 ${selectedIds.length} 条可疑评论吗？此操作不可撤销。`)) return;

    setIsBulkDeleting(true);
    const token = localStorage.getItem("admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    try {
      const results = await Promise.all(selectedIds.map((id) => fetch(`${apiUrl}/api/admin/comments/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      })));
      const deletedIds = selectedIds.filter((_, index) => results[index]?.ok);

      setComments((current) => current.filter((comment) => !deletedIds.includes(comment.id)));
      setSelectedIds((current) => current.filter((id) => !deletedIds.includes(id)));
      showMsg(deletedIds.length === selectedIds.length ? "success" : "error", `已删除 ${deletedIds.length} 条可疑评论`);
    } catch {
      showMsg("error", "批量删除失败");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <div className="admin-page-kicker">COMMENT DESK</div>
          <h1 className="admin-page-title">评论管理</h1>
          <p className="admin-page-desc">集中处理读者留言、站内互动和已回复记录。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setRiskFilter("all")}
            className={`admin-button-secondary px-3 py-2 ${riskFilter === "all" ? "border-primary text-primary" : ""}`}
          >
            全部 {comments.length}
          </button>
          <button
            onClick={() => setRiskFilter("risk")}
            className={`admin-button-secondary px-3 py-2 ${riskFilter === "risk" ? "border-primary text-primary" : ""}`}
          >
            可疑 {riskyCount}
          </button>
        </div>
      </header>

      <section className="admin-panel admin-panel-pad flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold">可疑评论处置</p>
          <p className="mt-1 text-sm text-muted-foreground">命中探测规则的评论可先筛选、再批量选中删除。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={toggleSelectVisibleRisk}
            disabled={visibleRiskIds.length === 0}
            className="admin-button-secondary px-3 py-2"
          >
            {hasSelectedAllVisibleRisk ? "取消选择可疑" : "选择当前可疑"}
          </button>
          <button
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0 || isBulkDeleting}
            className="admin-button px-3 py-2"
          >
            {isBulkDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            删除已选 {selectedIds.length}
          </button>
        </div>
      </section>

      {message && (
        <div className={`fixed right-6 top-6 z-[100] flex items-center gap-2 border px-4 py-3 text-sm font-bold shadow-lg ${
          message.type === "success" ? "border-emerald-600/40 bg-background text-emerald-700 dark:text-emerald-400" : "border-primary bg-background text-primary"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      <section className="grid gap-4">
        {visibleComments.length > 0 ? visibleComments.map(({ comment, risk }) => (
          <article key={comment.id} className={`admin-panel admin-panel-pad ${risk.flagged ? "border-primary/70 bg-primary/5" : ""}`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  {risk.flagged && (
                    <label className="inline-flex cursor-pointer items-center gap-2 font-mono text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(comment.id)}
                        onChange={() => toggleSelect(comment.id)}
                        className="h-4 w-4 accent-primary"
                      />
                      选中
                    </label>
                  )}
                  <span className="inline-flex items-center gap-2 font-bold">
                    <User className="h-4 w-4 text-primary" />
                    {risk.flagged ? compactUntrustedText(comment.nickname, 48) : comment.nickname}
                  </span>
                  <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                  <span className="inline-flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{comment.post_title}</span>
                  </span>
                  {risk.flagged && (
                    <span className="border border-primary px-2 py-1 font-mono text-[10px] font-bold text-primary">
                      {risk.labels.join(" / ")}
                    </span>
                  )}
                </div>

                {risk.flagged ? (
                  <div className="admin-muted-box mt-4 p-4 text-sm leading-7">
                    <p className="font-bold text-primary">可疑评论内容已折叠</p>
                    <p className="mt-1 text-muted-foreground">这条记录命中了后台探测规则，默认不在列表中展开原文。</p>
                    <details className="mt-3">
                      <summary className="cursor-pointer font-mono text-xs text-muted-foreground hover:text-primary">查看原始评论</summary>
                      <pre className="mt-2 whitespace-pre-wrap break-all border border-border bg-background p-3 font-mono text-xs text-muted-foreground">
                        {compactUntrustedText(comment.content, 800)}
                      </pre>
                    </details>
                  </div>
                ) : (
                  <div className="admin-muted-box mt-4 p-4 text-sm leading-7">{comment.content}</div>
                )}

                {comment.reply_content && (
                  <div className="mt-4 border-l-4 border-primary bg-primary/5 p-4 text-sm leading-7">
                    <div className="mb-1 flex items-center gap-2 font-mono text-xs font-bold text-primary">
                      <Reply className="h-3.5 w-3.5" />
                      我的回复
                    </div>
                    <p className="text-muted-foreground">{comment.reply_content}</p>
                  </div>
                )}

                {replyId === comment.id && (
                  <div className="mt-4 space-y-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="输入回复内容"
                      className="admin-input min-h-28 resize-y"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setReplyId(null)} className="admin-button-secondary px-3 py-2">取消</button>
                      <button onClick={() => handleReply(comment.id)} className="admin-button px-3 py-2">提交回复</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 lg:flex-col">
                <button
                  onClick={() => {
                    setReplyId(comment.id);
                    setReplyText(comment.reply_content || "");
                  }}
                  className="admin-icon-button"
                  title="回复"
                >
                  <Reply className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(comment.id)} className="admin-icon-button hover:border-primary hover:text-primary" title="删除">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        )) : (
          <div className="admin-panel px-5 py-16 text-center text-sm text-muted-foreground">
            {riskFilter === "risk" ? "暂无可疑评论" : "暂无评论记录"}
          </div>
        )}
      </section>
    </div>
  );
}
