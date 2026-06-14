-- 念舒的数字花园 D1 数据库表结构

-- 1. 文章与随笔主表
CREATE TABLE IF NOT EXISTS posts (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'post' 或 'essay'
  category TEXT,
  date TEXT,
  reading_time TEXT,
  cover TEXT,
  tags TEXT, -- 存储为 JSON 字符串
  content TEXT, -- Markdown 内容
  published INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 动态统计表（浏览量、点赞数）
CREATE TABLE IF NOT EXISTS stats (
  slug TEXT PRIMARY KEY,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (slug) REFERENCES posts(slug) ON DELETE CASCADE
);

-- 3. 初始化一些基础索引
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date);

-- 4. 评论表
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  nickname TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (slug) REFERENCES posts(slug) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_comments_slug ON comments(slug);

-- 5. 收藏同步表
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  openid TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(openid, slug)
);

CREATE INDEX IF NOT EXISTS idx_favorites_openid ON favorites(openid);

-- 6. 全站配置表
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
