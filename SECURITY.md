# 安全配置说明

本项目已实施以下安全措施来保护网站和用户数据。

## 🔒 已实施的安全措施

### 1. 路径遍历防护
- **位置**: `src/lib/posts.ts`
- **措施**: 
  - 添加slug格式验证，只允许字母、数字、中文、连字符和下划线
  - 验证解码后的slug格式
  - 确保目标文件路径在预期目录内

### 2. XSS (跨站脚本) 防护
- **位置**: `src/app/blog/[slug]/page.tsx`, `src/app/essays/[slug]/page.tsx`
- **措施**:
  - 使用DOMPurify净化Markdown内容
  - 限制允许的HTML标签和属性
  - 验证图片URL协议和长度
  - 验证图片宽度参数范围

### 3. 内容安全策略 (CSP)
- **位置**: `next.config.ts`
- **措施**:
  - 限制脚本来源
  - 限制图片来源
  - 限制样式来源
  - 禁止对象和插件加载
  - 限制表单提交目标

### 4. HTTP安全头
- **位置**: `next.config.ts`
- **措施**:
  - `X-Frame-Options: DENY` - 防止点击劫持
  - `X-Content-Type-Options: nosniff` - 防止MIME类型混淆
  - `Referrer-Policy: strict-origin-when-cross-origin` - 控制引用信息泄露
  - `X-XSS-Protection: 1; mode=block` - 启用XSS过滤
  - `Strict-Transport-Security: max-age=31536000` - 强制HTTPS
  - `Permissions-Policy` - 限制浏览器功能访问

### 5. 外部脚本安全
- **位置**: `src/components/Busuanzi.tsx`
- **措施**:
  - 使用HTTPS协议加载脚本
  - 添加crossOrigin属性
  - 未来可添加integrity校验

### 6. 敏感信息保护
- **位置**: 环境变量
- **措施**:
  - Google AdSense ID使用环境变量
  - Cloudflare Token使用环境变量
  - Giscus配置使用环境变量
  - 提供`.env.local.example`模板

## 🛠️ 配置说明

### 环境变量配置

复制 `.env.local.example` 为 `.env.local` 并配置：

```bash
# 网站基础URL
NEXT_PUBLIC_SITE_URL=https://blog.nianshu2022.cn

# Google AdSense (可选)
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx

# Cloudflare Analytics (可选)
NEXT_PUBLIC_CLOUDFLARE_TOKEN=your_token_here

# Giscus评论 (可选)
NEXT_PUBLIC_GISCUS_REPO=your_username/your_repo
NEXT_PUBLIC_GISCUS_REPO_ID=your_repo_id
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your_category_id
```

### 安全检查清单

- [ ] 已配置环境变量
- [ ] 已设置CSP策略
- [ ] 已启用HTTPS
- [ ] 已验证所有外部脚本使用HTTPS
- [ ] 已测试路径遍历防护
- [ ] 已测试XSS防护
- [ ] 已验证图片URL验证

## 🚨 安全建议

### 定期维护
1. **更新依赖**: 定期运行 `npm audit` 检查漏洞
2. **检查日志**: 监控异常访问模式
3. **更新CSP**: 根据新需求调整CSP策略

### 部署建议
1. **使用HTTPS**: 确保生产环境使用HTTPS
2. **启用防火墙**: 配置WAF规则
3. **定期备份**: 备份数据和配置

### 开发建议
1. **代码审查**: 实施安全代码审查流程
2. **输入验证**: 对所有用户输入进行验证
3. **输出编码**: 对所有输出进行适当的编码

## 📊 安全测试

### 手动测试
```bash
# 测试路径遍历
curl https://your-site.com/blog/../../../etc/passwd

# 测试XSS
curl https://your-site.com/blog/<script>alert(1)</script>

# 测试CSP
curl -I https://your-site.com | grep -i "content-security-policy"
```

### 自动化测试
建议使用以下工具进行安全扫描：
- OWASP ZAP
- Burp Suite
- Nmap

## 🆘 安全事件响应

如果发现安全漏洞：

1. **立即隔离**: 暂停受影响的服务
2. **评估影响**: 确定受影响的数据和用户
3. **修复漏洞**: 应用安全补丁
4. **通知用户**: 如有必要，通知受影响的用户
5. **记录事件**: 详细记录安全事件和响应过程

## 📝 更新日志

### 2025-12-21
- ✅ 添加路径遍历防护
- ✅ 添加XSS防护 (DOMPurify)
- ✅ 配置CSP策略
- ✅ 添加安全HTTP头
- ✅ 修复外部脚本HTTPS
- ✅ 实施环境变量配置

---

如有安全问题或建议，请联系项目维护者。
