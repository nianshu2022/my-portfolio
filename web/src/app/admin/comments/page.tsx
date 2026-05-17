"use client";

import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Trash2, 
  Reply, 
  User, 
  Calendar,
  FileText,
  Loader2,
  CheckCircle2,
  XCircle
} from "lucide-react";

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
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchComments = async () => {
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/admin/comments`, {
        headers: { "Authorization": `Bearer ${token}` }
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

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这条评论吗？此操作不可撤销。")) return;
    
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/admin/comments/delete`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setComments(comments.filter(c => c.id !== id));
        showMsg("success", "评论已删除");
      }
    } catch (err) {
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
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ id, reply_content: replyText })
      });
      if (res.ok) {
        setComments(comments.map(c => c.id === id ? { ...c, reply_content: replyText } : c));
        setReplyId(null);
        setReplyText("");
        showMsg("success", "已回复评论");
      }
    } catch (err) {
      showMsg("error", "回复失败");
    }
  };

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center text-slate-400"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">评论管理</h1>
          <p className="mt-1 text-sm text-slate-400">全站读者的留言在这里汇总处理。</p>
        </div>
        <div className="rounded-full bg-primary/10 px-4 py-1 text-xs font-bold text-primary ring-1 ring-primary/20">
          共 {comments.length} 条评论
        </div>
      </header>

      {/* 提示消息 */}
      {message && (
        <div className={`fixed right-8 top-8 z-[100] flex items-center gap-2 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-4 ${
          message.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-red-500/20 bg-red-500/10 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid gap-4">
        {comments.map((comment) => (
          <div key={comment.id} className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.04] hover:border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-slate-200">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-bold">{comment.nickname}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(comment.created_at).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FileText className="h-3 w-3" />
                    <span>文章: </span>
                    <span className="text-slate-300 font-medium">{comment.post_title}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-white/5 p-4 text-sm leading-relaxed text-slate-300 border border-white/5">
                  {comment.content}
                </div>

                {comment.reply_content && (
                  <div className="ml-4 rounded-xl border-l-2 border-primary/30 bg-primary/5 p-4 text-sm">
                    <div className="mb-1 flex items-center gap-2 text-xs font-bold text-primary">
                      <Reply className="h-3 w-3" /> 我的回复
                    </div>
                    <p className="text-slate-400">{comment.reply_content}</p>
                  </div>
                )}

                {replyId === comment.id && (
                  <div className="mt-4 space-y-3 animate-in zoom-in-95 duration-200">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="输入你的回复..."
                      className="w-full rounded-xl border border-primary/30 bg-black/40 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-primary"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setReplyId(null)} className="rounded-lg px-4 py-2 text-xs text-slate-500 hover:text-white transition-colors">取消</button>
                      <button onClick={() => handleReply(comment.id)} className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/80 transition-colors">提交回复</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => { setReplyId(comment.id); setReplyText(comment.reply_content || ""); }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-500 hover:bg-primary/20 hover:text-primary transition-all"
                  title="回复"
                >
                  <Reply className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleDelete(comment.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-all"
                  title="删除"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
