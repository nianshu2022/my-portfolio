---
title: "抛弃内网穿透与动态域名！用 Cloudflare Tunnel + Zero Trust 优雅且安全地接入 Homelab 边缘设备"
date: "2026-05-10"
description: "没有公网 IP，也不想在路由器暴露危险端口？本文手把手教你利用 Cloudflare Tunnel 穿透 NAT，配合 Cloudflare Zero Trust 构建单点登录（SSO）防护墙，优雅无感地接入内网监控及 NAS 设备。"
tags: ["Cloudflare", "ZeroTrust", "Homelab", "内网穿透", "网络安全"]
---

> **前言**：折腾 Homelab 和家用自建服务器（NAS、智能家居监控、个人云盘）的朋友，都避不开一个痛点问题：**如何从外网优雅安全地访问家里的内网服务？**
>
> 传统的 DDNS（动态域名）+ 端口映射（Port Forwarding）方案虽然直接，但有两个致命隐患：一是很多宽带运营商已经不再分配公网 IPv4 地址；二是将家里的路由器端口裸露在公网上，会频繁遭受恶意脚本的漏洞扫扫描与暴力破解，安全风险极高。
>
> 今天，我将为你介绍目前最为安全、优雅的解决方案 —— 基于 **Cloudflare Tunnel** 与 **Zero Trust（零信任 Access）** 的安全接入范式。免费、不需要公网 IP、不需要改路由器端口，还能顺便加上 GitHub/Google 的单点登录鉴权面板！🛡️

---

## 🔒 阶段一：为什么选择 Cloudflare Tunnel？

传统的内网穿透工具（如 Frp）需要你自备一台拥有公网 IP 的云服务器作为“中继点”，不仅增加额外的宽带租用成本，而且转发速率严重受限于你的云主机宽带上限。

而 **Cloudflare Tunnel** 的工作原理完全不同：
1. 它通过在你的内网服务器（宿主侧）运行一个轻量级的 `cloudflared` 守护进程。
2. 该进程与 Cloudflare 最近的边缘节点建立加密的双向长连接（Outbound Tunnel）。
3. 当外部访客通过你的域名进行访问时，请求将安全地在 Cloudflare 全球 CDN 网络中中转，并顺着双向通道流入你的内网设备。
4. **优势**：你不需要暴露任何入站端口（关闭入站防火墙），彻底阻断了公网扫描；还能免费白嫖 Cloudflare 的高防 DDoS 与全球 CDN 加速！

---

## 🛠️ 阶段二：命令行创建与配置 Tunnel

接下来，我们以在局域网内运行的 Ubuntu/Docker 环境为例，介绍如何一步步拉通这个专属加密隧道。

### 1. 安装 `cloudflared` 客户端
在你的内网设备（例如软路由、树莓派或 NAS）上下载官方客户端：

* **Debian/Ubuntu 一键安装**：
  ```bash
  curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
  sudo dpkg -i cloudflared.deb
  ```

### 2. 授权登录与绑定域名
在终端中执行登录验证指令，终端会输出一个授权链接，复制该链接在浏览器中打开，登录你的 Cloudflare 账户并选择你绑定的域名：

```bash
cloudflared tunnel login
```
登录成功后，客户端会自动下载你的专属密钥凭证（存放在本地 `~/.cloudflared/cert.pem`）。

### 3. 创建专属加密通道
运行以下指令创建一个名为 `my-homelab` 的隧道，系统会返回一串唯一的 Tunnel UUID（例如 `3f1e948c-xxx-xxx`）：

```bash
cloudflared tunnel create my-homelab
```

### 4. 编写本地反向代理映射表 (config.yml)
在 `~/.cloudflared/` 目录下新建一个 `config.yml` 配置文件，用于配置域名的入站分发映射关系：

```yaml
# 填入你刚才创建的 Tunnel UUID
tunnel: 3f1e948c-xxx-xxx
credentials-file: /home/nianshu/.cloudflared/3f1e948c-xxx-xxx.json

ingress:
  # 映射一：将个人网站状态监控分配至内网的 3001 端口
  - hostname: status.nianshu2022.cn
    service: http://localhost:3001
  
  # 映射二：将 NAS 私有云盘分配至内网的 5000 端口
  - hostname: nas.nianshu2022.cn
    service: http://192.168.1.100:5000
    
  # 最后一项必须是 404 回退规则，拦截所有未匹配请求
  - service: http_status:404
```

### 5. 绑定 DNS 并启动服务
将域名 CNAME 记录绑定到你的隧道地址，并让 Tunnel 作为系统服务在后台常驻运行：

```bash
# 绑定路由关系
cloudflared tunnel route dns my-homelab status.nianshu2022.cn

# 将其注册为 systemd 系统级服务常驻
sudo cloudflared service install
sudo systemctl start cloudflared
```

此时，你就可以尝试从外部网络访问 `status.nianshu2022.cn`，你的内网服务已经能够完美访问了！

---

## 🛡️ 阶段三：叠加 Zero Trust 零信任鉴权锁 (SSO)

虽然隧道拉通了，但是像 NAS 或是个人路由器管理后台这种敏感的内网服务，一旦直接暴露在公网上，就算域名很隐蔽，依然面临被爬虫撞库扫描的安全风险。

这时，我们可以白嫖 **Cloudflare Zero Trust**，在你的子域名访问之前，强行拦截并插上一道极其高大上的“单点登录（SSO）安全锁”！

### ⚙️ 接入配置步骤：
1. 登录你的 [Cloudflare Dashboard](https://dash.cloudflare.com/)，在左侧导航栏点击 **Zero Trust**（首次加入可免费订阅 50 人版方案）。
2. **配置认证中心 (Authentication)**：
   * 在 Zero Trust 后台点击 `Settings` -> `Authentication`。
   * 选择添加第三方登录方式（Identity Providers），支持绑定你的 GitHub、Google 甚至微信/飞书企业登录鉴权（以 GitHub 授权为例，按指引在 GitHub Developer Settings 创建一个 OAuth App 即可绑定）。
3. **创建访问控制策略 (Access - Applications)**：
   * 点击 `Access` -> `Applications` -> `Add an application` -> 选择 `Self-hosted`。
   * **输入域名**：比如填入 `nas.nianshu2022.cn`。
   * **配置访问规则 (Policies)**：
     * 创建一条包含（Include）策略，设置只允许特定的邮箱地址（比如你的个人邮箱 `yourname@sina.cn`）通过鉴权；或者只允许属于特定 GitHub 组织的用户访问。
4. **保存应用**。

---

## ✨ 完美成效演示

当外部任何陌生访客在浏览器中敲下 `https://nas.nianshu2022.cn` 时，他们将无法窥探到你 NAS 登录后台的任何细节。页面会被 Cloudflare 直接强行重定向至一个高颜值的**零信任鉴权验证页面**：

> **页面显示**：*“请选择您的认证方式：使用 GitHub 登录”*
>
> 只有当你通过你的 GitHub 账号登录成功，且后台验证你的 GitHub ID 与你设置的个人白名单邮箱完全一致时，Cloudflare 才会给你的浏览器下发安全 Cookie（JWT Token），放行你的访问请求。

### 📝 总结
通过 `Cloudflare Tunnel + Zero Trust` 这套黄金组合，我们彻底抛弃了危险的端口映射，不需要购买中继服务器，并且以零成本的方式为家用 Homelab 裹上了一层媲美大型企业安全等级的 **“零信任网络外壳”**。安全、极客、且体验极佳！🍀
