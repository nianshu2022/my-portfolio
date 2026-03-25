---
title: "Windows 离线安装 Docker Desktop 完全指南（含常见报错解决）"
date: "2026-03-20"
description: "在无法联网的内网环境中，如何一步步完成 Docker Desktop 的安装？本文涵盖完整离线安装流程，并重点解决 WSL 版本过低导致 Docker 无法启动的问题。"
tags: ["Docker", "Windows", "WSL", "运维", "离线安装"]
---

> **前言**：最近在公司内网环境（无法访问互联网）的 Windows 机器上安装 Docker Desktop，踩了不少坑。最头疼的就是 Docker 启动时疯狂报错，提示 WSL 需要更新，但机器根本没网……
>
> 本文记录完整的离线安装流程，以及我遇到的几个典型报错和对应解决办法，希望能帮到同样在内网环境折腾的朋友 🤗

---

## 📋 前置准备（在有网的机器上完成）

安装前，你需要在一台**能联网的电脑**上提前下载好以下几个文件，然后通过 U 盘拷贝到目标机器：

| 文件 | 下载地址 | 说明 |
|---|---|---|
| Docker Desktop 安装包 | [Docker 官网](https://www.docker.com/products/docker-desktop/) | 选 `Windows - AMD64`，文件名形如 `Docker Desktop Installer.exe` |
| WSL 离线应用包 | [WSL GitHub Releases](https://github.com/microsoft/WSL/releases) | 下载 `.msixbundle` 格式，约 100MB |
| WSL2 Linux 内核更新包 | [微软官方地址](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi) | 文件名 `wsl_update_x64.msi` |

> **WSL 离线应用包注意事项**：在 GitHub Releases 页面，找到带 **Latest** 标签的最新正式版，在 **Assets** 列表中下载 `.msixbundle` 后缀的文件，文件名形如：
> `Microsoft.WSL_2.x.x.0_x64_ARM64.msixbundle`

---

## 🛠️ 安装步骤

### 第一步：启用 Windows 必要功能

以**管理员权限**打开 PowerShell，依次执行：

```powershell
# 启用 WSL 功能
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# 启用虚拟机平台功能（WSL 2 所必需）
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

执行完毕后，**重启电脑**。

### 第二步：离线安装 WSL2 内核更新包

重启后，双击运行之前下载的 `wsl_update_x64.msi`，一路 `Next` 安装完成即可。

这一步会将 WSL 的 Linux 内核更新到 WSL 2 所需的版本。

### 第三步：离线安装 WSL 完整应用包

> ⚠️ **这一步是重点，也是坑最多的地方，详见下文「常见问题」。**

以**管理员权限**打开 PowerShell，执行以下命令（将路径替换为你的实际路径）：

```powershell
Add-AppxPackage -Path "C:\你的路径\Microsoft.WSL_2.x.x.0_x64_ARM64.msixbundle"
```

**举例**：如果你把文件放在了桌面，文件名是 `Microsoft.WSL_2.1.5.0_x64_ARM64.msixbundle`，则命令为：

```powershell
Add-AppxPackage -Path "C:\Users\YourName\Desktop\Microsoft.WSL_2.1.5.0_x64_ARM64.msixbundle"
```

等待进度条走完，没有报错即为安装成功。

### 第四步：设置 WSL 2 为默认版本

```powershell
wsl --set-default-version 2
```

### 第五步：验证 WSL 安装状态

```powershell
wsl --version
```

如果能正常输出版本信息（如下所示），说明 WSL 已就绪：

```
WSL 版本： 2.1.5.0
内核版本： 5.15.146.1-2
WSLg 版本： 1.0.60
...
```

### 第六步：安装 Docker Desktop

双击运行 `Docker Desktop Installer.exe`，安装过程中注意：

- **Use WSL 2 instead of Hyper-V** 选项保持勾选（推荐）
- 等待安装完成后，启动 Docker Desktop

启动成功，你会在任务栏托盘看到那只小鲸鱼 🐳，状态变为绿色（Running）。

---

## 🐛 常见问题与解决

### 问题一：Docker 启动时报 "WSL version too old" 或要求更新 WSL

**报错现象**：

Docker Desktop 启动后弹窗提示 WSL 版本过低，并尝试自动更新，但由于没有网络，更新失败，Docker 无法正常启动。

**原因分析**：

Docker 检测到你电脑上的 WSL 应用版本较旧，试图通过 `wsl --update` 从微软商店拉取最新版，但在离线环境下请求失败。

**解决方案**：

这就是为什么我们需要**单独下载 `.msixbundle` 格式的 WSL 完整应用包**进行离线安装，而不只是安装内核更新包。按照上文「第三步」操作即可。

```powershell
# 安装离线 WSL 应用包
Add-AppxPackage -Path "C:\你的路径\Microsoft.WSL_2.x.x.0_x64_ARM64.msixbundle"

# 确认版本正常输出
wsl --version

# 重新设置默认版本
wsl --set-default-version 2
```

完成后重启 Docker Desktop，应能正常启动。

---

### 问题二：`wsl --version` 提示 "未能将命令识别为 cmdlet......" 或无输出

**报错现象**：

执行 `wsl --version` 后，PowerShell 提示命令不存在，或者只输出帮助信息而没有版本号。

**原因分析**：

`--version` 参数是 WSL 2.x 新版本才有的特性。如果 WSL 还是旧版（1.x 时代的内置组件版本），则不支持此参数。这通常意味着上一步的 `.msixbundle` 没有安装成功。

**解决方案**：

1. 检查 `.msixbundle` 文件是否完整（可对比文件大小，正常约 100MB）
2. 确保以**管理员权限**运行 PowerShell
3. 重新执行 `Add-AppxPackage` 命令，观察是否有报错输出

---

### 问题三：`Add-AppxPackage` 执行报错 `0x80073CF0` 或 `0x80073D06`

**报错现象**：

执行安装命令时出现类似如下错误：

```
Add-AppxPackage : 部署失败，原因是 HRESULT: 0x80073CF0 ...
```

**原因分析**：

这类错误通常由以下原因导致：

- 文件下载不完整，包损坏
- 系统中已存在一个版本**更高**的 WSL，无法降级安装
- PowerShell 未以管理员身份运行

**解决方案**：

1. 重新下载 `.msixbundle` 文件，确保完整
2. 右键 PowerShell → **以管理员身份运行**
3. 执行 `winget list wsl` 或在「设置 → 应用」中搜索 WSL，确认当前已安装版本，然后从 GitHub Releases 下载**更新**的包版本

---

### 问题四：Docker Desktop 卡在 "Starting the Docker Engine..."

**报错现象**：

Docker Desktop 一直停留在启动中，长时间无法进入 Running 状态。

**解决方案**：

依次尝试以下方法：

1. **重置网络适配器**：以管理员身份运行 `netsh winsock reset`，然后重启
2. **彻底重启 WSL**：

   ```powershell
   wsl --shutdown
   # 等待 5 秒后再启动 Docker Desktop
   ```

3. **以管理员身份运行 Docker Desktop**：右键 Docker Desktop 图标 → 以管理员身份运行
4. **检查 Hyper-V/虚拟化**：在任务管理器 → 性能 → CPU 中确认「虚拟化」状态为「已启用」；若未启用，需进 BIOS 开启 VT-x / AMD-V

---

## ✅ 验证安装成功

Docker 启动成功（任务栏图标变绿）后，打开 PowerShell 执行：

```powershell
docker version
docker run hello-world
```

如果能正常输出版本信息并打印出 `Hello from Docker!`，恭喜你，离线安装完全成功！🎉

```
Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```

---

## 📝 总结

在内网离线环境安装 Docker Desktop，最关键的两点是：

1. **WSL 应用包（`.msixbundle`）必须单独下载**，不能只靠内核更新包（`.msi`）。Docker 新版本对 WSL 版本要求较高，缺少这个包会导致 Docker 频繁报错。
2. **全程需要管理员权限**，包括开启 Windows 功能和安装 AppX 包。

希望这篇记录能帮你少走弯路，有任何问题欢迎评论交流 💬
