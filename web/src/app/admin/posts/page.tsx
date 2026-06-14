"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, ExternalLink, Eye, FileText, Filter, Heart, Loader2, MessageSquare, Search } from "lucide-react";
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
        headers: { Authorization: `Bearer ${token}` },
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleStatus = async (id: number, currentStatus: string) => {
    const token = localStorage.getItem("admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const newStatus = currentStatus === "published" ? "draft" : "published";

    try {
      const res = await fetch(`${apiUrl}/api/admin/posts/${id}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchPosts();
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || post.type === filterType;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="admin-loading">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
        <p className="font-mono text-xs font-bold">调取文章案卷</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <div className="admin-page-kicker">CONTENT FILES</div>
          <h1 className="admin-page-title">文章管理</h1>
          <p className="admin-page-desc">管理技术案卷和成长样本的发布状态、访问数据与外部预览。</p>
        </div>
        <div className="admin-stamp">
          <FileText className="h-4 w-4" />
          共 {posts.length} 篇
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-[1fr_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索标题或 slug"
            className="admin-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <label className="admin-muted-box flex items-center gap-2 px-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select className="bg-transparent py-2.5 text-sm outline-none" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">所有类型</option>
            <option value="blog">技术案卷</option>
            <option value="essay">成长样本</option>
          </select>
        </label>
      </section>

      <section className="admin-panel overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>文章信息</th>
              <th>类型</th>
              <th>数据统计</th>
              <th>状态</th>
              <th className="text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id}>
                <td>
                  <span className="block max-w-xl font-bold line-clamp-1">{post.title}</span>
                  <span className="mt-1 block font-mono text-xs text-muted-foreground">{post.slug}</span>
                </td>
                <td>
                  <span className="border border-border px-2 py-1 font-mono text-xs text-primary">
                    {post.type === "blog" ? "技术案卷" : "成长样本"}
                  </span>
                </td>
                <td>
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{post.views}</span>
                    <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{post.likes}</span>
                    <span className="inline-flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{post.comment_count}</span>
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => toggleStatus(post.id, post.status)}
                    className={`inline-flex items-center gap-2 border px-3 py-1.5 text-xs font-bold transition-colors ${
                      post.status === "published"
                        ? "border-emerald-600/40 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
                        : "border-border bg-secondary text-muted-foreground"
                    }`}
                  >
                    {post.status === "published" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                    {post.status === "published" ? "已发布" : "草稿"}
                  </button>
                </td>
                <td className="text-right">
                  <Link href={`/blog/${post.slug}`} target="_blank" className="admin-icon-button ml-auto" title="打开前台页面">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPosts.length === 0 && <div className="px-5 py-16 text-center text-sm text-muted-foreground">没有找到匹配文章</div>}
      </section>
    </div>
  );
}
