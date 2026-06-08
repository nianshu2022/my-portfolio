"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Heart, 
  MessageSquare, 
  ExternalLink,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  slug: string;
  type: string;
  status: "published" | "draft";
  views: number;
  likes: number;
  comment_count: number;
  created_at: string;
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const fetchPosts = async () => {
    const token = localStorage.getItem("admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    
    try {
      const res = await fetch(`${apiUrl}/api/admin/posts`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data.results || data);
      }
    } catch (err) {
      console.error("Fetch posts error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const toggleStatus = async (id: number, currentStatus: string) => {
    const token = localStorage.getItem("admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const newStatus = currentStatus === "published" ? "draft" : "published";

    try {
      const res = await fetch(`${apiUrl}/api/admin/posts/${id}/status`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchPosts();
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || post.type === filterType;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium tracking-widest uppercase">Loading Posts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">文章管理</h1>
          <p className="mt-1 text-slate-400">管理档案局内容，控制发布状态与查看统计。</p>
        </div>
        <div className="flex h-10 items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-400 border border-white/5">
          <FileText className="h-4 w-4" />
          共 {posts.length} 篇文章
        </div>
      </header>

      {/* 搜索与过滤 */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="搜索文章标题或 Slug..."
            className="w-full rounded-xl border border-white/5 bg-white/[0.02] py-3 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-primary/30 focus:bg-white/[0.04]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3">
            <Filter className="h-4 w-4 text-slate-500" />
            <select 
              className="bg-transparent text-sm text-slate-300 outline-none"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">所有类型</option>
              <option value="blog">博文 (Blog)</option>
              <option value="essay">随笔 (Essay)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4">文章信息</th>
              <th className="px-6 py-4">类型</th>
              <th className="px-6 py-4">数据统计</th>
              <th className="px-6 py-4">状态</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {filteredPosts.map((post) => (
              <tr key={post.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-200 group-hover:text-primary transition-colors line-clamp-1">{post.title}</span>
                    <span className="text-xs text-slate-500 font-mono mt-1">{post.slug}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase ${
                    post.type === 'blog' ? 'bg-blue-400/10 text-blue-400' : 'bg-purple-400/10 text-purple-400'
                  }`}>
                    {post.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4 text-slate-400">
                    <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" />{post.views}</span>
                    <span className="flex items-center gap-1.5"><Heart className="h-3.5 w-3.5" />{post.likes}</span>
                    <span className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" />{post.comment_count}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleStatus(post.id, post.status)}
                    className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                      post.status === 'published' 
                      ? 'bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20' 
                      : 'bg-slate-400/10 text-slate-400 hover:bg-slate-400/20'
                    }`}
                  >
                    {post.status === 'published' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {post.status === 'published' ? '已发布' : '草稿'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      href={`/blog/${post.slug}`} 
                      target="_blank"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-primary/20 hover:text-primary transition-all"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPosts.length === 0 && (
          <div className="py-20 text-center text-slate-500">
            没有找到匹配的文章
          </div>
        )}
      </div>
    </div>
  );
}
