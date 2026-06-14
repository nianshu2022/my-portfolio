/**
 * 念舒的数字花园 - Cloudflare Worker API
 */

export interface Env {
  DB: D1Database;
  WX_APP_ID: string;
  WX_APP_SECRET: string;
  ADMIN_OPENID: string;   // 微信管理员 OpenID
  ADMIN_PASSWORD: string; // Web 端管理密码
}

// 辅助函数：校验管理员权限
function isAuthorized(request: Request, env: Env): boolean {
  const openid = request.headers.get("x-openid");
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  
  // 支持微信 OpenID 校验 或 Web 端 Token 校验 (此处简单演示，Token 直接对比密码)
  return (!!openid && openid === env.ADMIN_OPENID) || (!!token && token === env.ADMIN_PASSWORD);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // 允许跨域
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-openid, Authorization",
      "Content-Type": "application/json",
    };

    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 1. 微信登录 (Code 换 OpenID)
      if (path === "/api/auth/login" && method === "POST") {
        const { code } = await request.json() as any;
        if (!code) return new Response(JSON.stringify({ error: "Missing code" }), { status: 400, headers: corsHeaders });
        
        const wxUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${env.WX_APP_ID}&secret=${env.WX_APP_SECRET}&js_code=${code}&grant_type=authorization_code`;
        const wxRes = await fetch(wxUrl);
        const wxData = await wxRes.json() as any;
        
        return new Response(JSON.stringify(wxData), { headers: corsHeaders });
      }

      // 1.1 Web 管理员登录 (密码换 Token)
      if (path === "/api/auth/admin-login" && method === "POST") {
        const { password } = await request.json() as any;
        if (!password) return new Response(JSON.stringify({ error: "Missing password" }), { status: 400, headers: corsHeaders });
        
        if (password === env.ADMIN_PASSWORD) {
          return new Response(JSON.stringify({ success: true, token: env.ADMIN_PASSWORD }), { headers: corsHeaders });
        } else {
          return new Response(JSON.stringify({ error: "Invalid password" }), { status: 403, headers: corsHeaders });
        }
      }

      // 2. 获取文章列表
      if (path === "/api/garden" && method === "GET") {
        const { results } = await env.DB.prepare(`
          SELECT p.*, IFNULL(s.views, 0) as views, IFNULL(s.likes, 0) as likes 
          FROM posts p LEFT JOIN stats s ON p.slug = s.slug 
          WHERE p.published = 1 ORDER BY p.date DESC
        `).all();
        return new Response(JSON.stringify(results), { headers: corsHeaders });
      }

      // 3. 搜索接口
      if (path === "/api/search" && method === "GET") {
        const q = url.searchParams.get("q") || "";
        const query = `%${q}%`;
        const { results } = await env.DB.prepare(`
          SELECT p.*, IFNULL(s.views, 0) as views, IFNULL(s.likes, 0) as likes 
          FROM posts p LEFT JOIN stats s ON p.slug = s.slug 
          WHERE p.published = 1 AND (p.title LIKE ? OR p.description LIKE ? OR p.content LIKE ? OR p.tags LIKE ?)
          ORDER BY p.date DESC
        `).bind(query, query, query, query).all();
        return new Response(JSON.stringify(results), { headers: corsHeaders });
      }

      // 4. 获取详情 (带阅读统计)
      const detailMatch = path.match(/^\/api\/posts\/([^\/]+)$/);
      if (detailMatch && method === "GET") {
        const slug = detailMatch[1];
        const post = await env.DB.prepare("SELECT * FROM posts WHERE slug = ?").bind(slug).first();
        if (!post) return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: corsHeaders });

        try {
          await env.DB.prepare("INSERT INTO stats (slug, views, likes) VALUES (?, 1, 0) ON CONFLICT(slug) DO UPDATE SET views = views + 1").bind(slug).run();
        } catch (e) {}

        const stats = await env.DB.prepare("SELECT views, likes FROM stats WHERE slug = ?").bind(slug).first();
        return new Response(JSON.stringify({ ...post, ...stats }), { headers: corsHeaders });
      }

      // 5. 点赞
      const likeMatch = path.match(/^\/api\/posts\/([^\/]+)\/like$/);
      if (likeMatch && method === "POST") {
        const slug = likeMatch[1];
        await env.DB.prepare("INSERT INTO stats (slug, likes) VALUES (?, 1) ON CONFLICT(slug) DO UPDATE SET likes = likes + 1").bind(slug).run();
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      // 6. 标签列表
      if (path === "/api/tags" && method === "GET") {
        const { results } = await env.DB.prepare("SELECT tags FROM posts WHERE published = 1").all();
        const tagMap: Record<string, number> = {};
        results.forEach((row: any) => {
          try {
            JSON.parse(row.tags || "[]").forEach((tag: string) => tagMap[tag] = (tagMap[tag] || 0) + 1);
          } catch (e) {}
        });
        const tags = Object.entries(tagMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
        return new Response(JSON.stringify(tags), { headers: corsHeaders });
      }

      if (path === "/api/stats" && method === "GET") {
        const stats = await env.DB.prepare(`
          SELECT COALESCE(SUM(views), 0) as total_views
          FROM stats
        `).first();
        return new Response(JSON.stringify(stats), { headers: corsHeaders });
      }

      // 7. 评论 (GET/POST)
      const commentMatch = path.match(/^\/api\/posts\/([^\/]+)\/comments$/);
      if (commentMatch) {
        const slug = commentMatch[1];
        if (method === "GET") {
          const { results } = await env.DB.prepare("SELECT nickname, content, created_at FROM comments WHERE slug = ? ORDER BY created_at DESC").bind(slug).all();
          return new Response(JSON.stringify(results), { headers: corsHeaders });
        }
        if (method === "POST") {
          const { nickname, content } = await request.json() as any;
          if (!nickname || !content) return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers: corsHeaders });
          await env.DB.prepare("INSERT INTO comments (slug, nickname, content) VALUES (?, ?, ?)").bind(slug, nickname, content).run();
          return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }
      }

      // 8. 收藏相关 (需 openid)
      const openid = request.headers.get("x-openid");
      if (path === "/api/favorites" && method === "GET") {
        if (!openid) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
        const { results } = await env.DB.prepare("SELECT f.slug, p.title, p.type, p.date FROM favorites f JOIN posts p ON f.slug = p.slug WHERE f.openid = ? ORDER BY f.created_at DESC").bind(openid).all();
        return new Response(JSON.stringify(results), { headers: corsHeaders });
      }
      if (path === "/api/favorites/sync" && method === "POST") {
        if (!openid) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
        const { slugs } = await request.json() as any;
        if (slugs) for (const slug of slugs) await env.DB.prepare("INSERT OR IGNORE INTO favorites (openid, slug) VALUES (?, ?)").bind(openid, slug).run();
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }
      if (path === "/api/favorites/toggle" && method === "POST") {
        if (!openid) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
        const { slug, favorite } = await request.json() as any;
        if (favorite) await env.DB.prepare("INSERT OR IGNORE INTO favorites (openid, slug) VALUES (?, ?)").bind(openid, slug).run();
        else await env.DB.prepare("DELETE FROM favorites WHERE openid = ? AND slug = ?").bind(openid, slug).run();
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      // 9. 管理员权限校验
      if (path === "/api/admin/check" && method === "GET") {
        return new Response(JSON.stringify({ isAdmin: isAuthorized(request, env) }), { headers: corsHeaders });
      }

      // 10. 全局管理接口鉴权拦截
      if (path.startsWith("/api/admin/") && !isAuthorized(request, env)) {
        return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
      }

      // 10.1 管理员：全站统计
      if (path === "/api/admin/stats" && method === "GET") {
        const stats = await env.DB.prepare(`
          SELECT 
            (SELECT COALESCE(SUM(views), 0) FROM stats) as total_views,
            (SELECT COALESCE(SUM(likes), 0) FROM stats) as total_likes,
            (SELECT COUNT(*) FROM comments) as total_comments,
            (SELECT COUNT(*) FROM posts) as total_posts
        `).first();
        return new Response(JSON.stringify(stats), { headers: corsHeaders });
      }

      // 11. 管理员：全量留言列表
      if (path === "/api/admin/comments" && method === "GET") {
        const { results } = await env.DB.prepare(`
          SELECT c.*, p.title as post_title 
          FROM comments c 
          JOIN posts p ON c.slug = p.slug 
          ORDER BY c.created_at DESC
        `).all();
        return new Response(JSON.stringify(results), { headers: corsHeaders });
      }

      // 12. 管理员：删除留言
      if (path === "/api/admin/comments/delete" && method === "POST") {
        const { id } = await request.json() as any;
        if (!id) return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400, headers: corsHeaders });
        await env.DB.prepare("DELETE FROM comments WHERE id = ?").bind(id).run();
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      // 13. 管理员：全量文章列表
      if (path === "/api/admin/posts" && method === "GET") {
        const { results } = await env.DB.prepare("SELECT slug, title, type, date, published FROM posts ORDER BY date DESC").all();
        return new Response(JSON.stringify(results), { headers: corsHeaders });
      }

      // 14. 管理员：切换文章发布状态
      if (path === "/api/admin/posts/toggle" && method === "POST") {
        const { slug, published } = await request.json() as any;
        if (!slug) return new Response(JSON.stringify({ error: "Missing slug" }), { status: 400, headers: corsHeaders });
        await env.DB.prepare("UPDATE posts SET published = ? WHERE slug = ?").bind(published ? 1 : 0, slug).run();
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      // 15. 管理员：回复留言
      if (path === "/api/admin/comments/reply" && method === "POST") {
        const { id, reply_content } = await request.json() as any;
        if (!id) return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400, headers: corsHeaders });
        await env.DB.prepare("UPDATE comments SET reply_content = ?, replied_at = CURRENT_TIMESTAMP WHERE id = ?").bind(reply_content, id).run();
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      // 16. 管理员：热门内容排行
      if (path === "/api/admin/posts/rank" && method === "GET") {
        const { results } = await env.DB.prepare(`
          SELECT p.title, s.views, s.likes 
          FROM posts p 
          JOIN stats s ON p.slug = s.slug 
          ORDER BY s.views DESC LIMIT 5
        `).all();
        return new Response(JSON.stringify(results), { headers: corsHeaders });
      }

      // 17. 管理员：全站最新动态
      if (path === "/api/admin/activities" && method === "GET") {
        const { results: comments } = await env.DB.prepare(`
          SELECT 'comment' as type, nickname as user, content as msg, created_at as time, slug 
          FROM comments ORDER BY created_at DESC LIMIT 10
        `).all();
        const { results: favorites } = await env.DB.prepare(`
          SELECT 'favorite' as type, '匿名读者' as user, '收藏了你的文章' as msg, created_at as time, slug 
          FROM favorites ORDER BY created_at DESC LIMIT 10
        `).all();
        const activities = [...(comments as any), ...(favorites as any)]
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
          .slice(0, 15);
        return new Response(JSON.stringify(activities), { headers: corsHeaders });
      }

      // 18. 公开：获取全站配置
      if (path === "/api/settings" && method === "GET") {
        const { results } = await env.DB.prepare("SELECT key, value FROM settings").all();
        const settings = results.reduce((acc: any, cur: any) => {
          acc[cur.key] = cur.value;
          return acc;
        }, {});
        return new Response(JSON.stringify(settings), { headers: corsHeaders });
      }

      // 19. 管理员：更新配置
      if (path === "/api/admin/settings/update" && method === "POST") {
        const { key, value } = await request.json() as any;
        if (!key) return new Response(JSON.stringify({ error: "Missing Key" }), { status: 400, headers: corsHeaders });
        await env.DB.prepare("INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)").bind(key, value).run();
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      // 20. 管理员：系统健康监控
      if (path === "/api/admin/health" && method === "GET") {
        const counts = await env.DB.prepare(`
          SELECT 
            (SELECT COUNT(*) FROM posts) as post_count,
            (SELECT COUNT(*) FROM comments) as comment_count,
            (SELECT COUNT(*) FROM favorites) as favorite_count,
            (SELECT COUNT(*) FROM stats) as stats_count
        `).first();
        return new Response(JSON.stringify({
          database: counts,
          platform: "Cloudflare Workers",
          runtime: "V8 (Edge)",
          location: request.cf?.colo || "Unknown"
        }), { headers: corsHeaders });
      }

      // 21. 管理员：文章列表 (含草稿)
      if (path === "/api/admin/posts" && method === "GET") {
        const { results } = await env.DB.prepare(`
          SELECT p.*, 
            (SELECT COUNT(*) FROM comments WHERE post_slug = p.slug) as comment_count
          FROM posts p
          ORDER BY p.created_at DESC
        `).all();
        return new Response(JSON.stringify(results), { headers: corsHeaders });
      }

      // 22. 管理员：切换文章状态
      if (path.startsWith("/api/admin/posts/") && path.endsWith("/status") && method === "POST") {
        const id = path.split("/")[4];
        const { status } = await request.json() as any;
        await env.DB.prepare("UPDATE posts SET status = ? WHERE id = ?").bind(status, id).run();
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      // 23. 管理员：获取全站动态流
      if (path === "/api/admin/activities" && method === "GET") {
        const { results } = await env.DB.prepare(`
          SELECT 'comment' as type, user_name as user, content as msg, created_at as time, post_slug as slug
          FROM comments
          UNION ALL
          SELECT 'favorite' as type, '匿名用户' as user, '收藏了文章' as msg, created_at as time, post_slug as slug
          FROM favorites
          ORDER BY time DESC
          LIMIT 20
        `).all();
        return new Response(JSON.stringify(results), { headers: corsHeaders });
      }

      // 24. 管理员：清理无效统计数据
      if (path === "/api/admin/clean-stats" && method === "POST") {
        await env.DB.prepare(`
          DELETE FROM stats 
          WHERE post_slug NOT IN (SELECT slug FROM posts)
        `).run();
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: corsHeaders });

    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }
};
