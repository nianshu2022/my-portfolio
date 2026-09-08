-- 念舒个人空间 D1 数据库表结构

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

-- 7. 机密档案分享表 (暗号传输柜)
CREATE TABLE IF NOT EXISTS secure_shares (
  id TEXT PRIMARY KEY,                   -- 8位随机高强度 Slug (如 a1b2c3d4)
  ciphertext TEXT NOT NULL,              -- AES-GCM 加密后的 JSON 密文 (Base64)
  iv TEXT NOT NULL,                      -- 初始向量 (Base64)
  salt TEXT NOT NULL,                    -- 密钥派生盐值 S1 (Base64)
  verifier TEXT NOT NULL,                -- 密码验证器 SHA-256(P + S2)
  verifier_salt TEXT NOT NULL,           -- 验证盐值 S2 (Base64)
  type TEXT NOT NULL,                    -- 'text' (文本) 或 'file' (文件)
  filesize INTEGER DEFAULT 0,            -- 文件大小 (字节，仅用于前端未解密时展示)
  burn_after_reading INTEGER DEFAULT 0,  -- 是否阅后即焚 (0: 否, 1: 是)
  failed_attempts INTEGER DEFAULT 0,     -- 密码尝试失败次数
  expires_at DATETIME,                   -- 过期时间 (NULL 表示永久)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_secure_shares_expires ON secure_shares(expires_at);

