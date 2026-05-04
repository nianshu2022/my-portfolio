---
title: "内网 Nexus 离线 PyPI 镜像搭建全攻略（含 PyTorch CUDA 版）"
date: "2026-03-25"
description: "物理隔离内网、无法访问外网？本文手把手教你用 Sonatype Nexus 搭建私有 PyPI 镜像，完整覆盖仓库创建、离线包下载、twine 批量推送与 pip 配置，并附常见报错排查表。"
tags: ["Nexus", "PyPI", "Python", "运维", "离线部署", "内网"]
---

> **前言**：最近在一个与外网完全物理隔离的内网环境里部署 Python 项目，第一道坎就是 `pip install` 根本无法联网。  
>   
> 折腾了一圈，最终选定 **Sonatype Nexus Repository Manager** 作为私有 PyPI 镜像站——它免费、成熟、权限管理完善，而且同一套 Nexus 实例还能顺手管 Maven、npm。本文记录完整的搭建流程，希望帮你少踩些坑 🤗

---

## 📋 前置说明

| 项目 | 要求 |
|------|------|
| **适用场景** | Nexus 服务器与开发机均处于物理隔离内网，无法访问外网 |
| **操作系统** | Windows |
| **关键前提** | 外网跳板机须安装与内网开发机**完全相同版本**的 Python |

> 版本一致性非常重要！Python 在打包时会根据版本和平台生成对应的 `.whl` 文件名（如 `cp311-win_amd64`），跳板机和内网机版本不一致会导致包无法安装。

---

## 🏗️ 第一步：在 Nexus 中创建仓库

登录 Nexus 管理后台（默认地址 `http://<Nexus_IP>:8081`），进入 **Repository → Repositories → Create repository**，依次创建以下两个仓库：

| 步骤 | 仓库类型 | 建议名称 | 关键配置 |
|------|----------|----------|----------|
| 1 | PyPI (hosted) | `pypi-local` | 用于接收手动上传的离线包 |
| 2 | PyPI (group) | `pypi-group` | 成员仅加入 `pypi-local`；对外统一暴露此地址 |

> 💡 **扩展提示**：如果未来 Nexus 恢复联网，可再添加一个 `pypi-proxy` 代理仓库并加入 group，即可实现**自动拉取 + 本地缓存**，无需修改开发机任何配置。

---

## 📦 第二步：在外网跳板机下载离线包

在一台**能访问公网**的 Windows 机器（Python 版本与内网机一致）上执行：

```bash
# 进入存放 requirements.txt 的目录
cd d:\PyPI

# 下载项目依赖（含 PyTorch CUDA 专属包），保存至 offline_packages 文件夹
pip download -r requirements.txt -d ./offline_packages --extra-index-url https://download.pytorch.org/whl/cu121

# 顺带下载上传工具 twine 及其全部依赖
pip download twine -d ./offline_packages
```

执行完毕后，`d:\PyPI\offline_packages` 目录中将包含 `.whl` / `.tar.gz` 格式的所有离线安装包。

> ⚠️ **PyTorch 用户注意**：`--extra-index-url https://download.pytorch.org/whl/cu121` 是下载带 CUDA 12.1 支持的 PyTorch 专属包的关键参数，缺少它只会下载到 CPU 版本。

---

## 🚛 第三步：将离线包拷入内网

将 `offline_packages` 整个文件夹通过 **U 盘** 或**内网文件共享**拷贝到内网机器上。

---

## 🔧 第四步：在内网机上安装 twine

在内网机上打开命令行，进入 `offline_packages` 所在目录，执行离线安装：

```bash
pip install --no-index --find-links=.\offline_packages twine
```

`--no-index` 告诉 pip 不要尝试访问任何网络源，`--find-links` 指定本地目录作为包来源，两者配合实现完全离线安装。

---

## 🚀 第五步：批量推送离线包至 Nexus

使用 `twine` 将 `offline_packages` 中的所有包一次性上传到 Nexus `pypi-local` 仓库：

```bash
twine upload ^
  --repository-url http://<Nexus_IP>:8081/repository/pypi-local/ ^
  -u <Nexus用户名> ^
  -p <Nexus密码> ^
  .\offline_packages\*
```

> 上传完成后 Nexus 会自动重建索引，稍等片刻即可在管理界面的包列表中看到所有已上传的包。

---

## ⚙️ 第六步：配置开发机 pip 指向内网 Nexus

在 Windows 上，`pip` 的全局配置文件路径为：

```
%APPDATA%\pip\pip.ini
```

如果文件不存在，手动新建，写入以下内容（将 `<Nexus_IP>` 替换为实际 IP）：

```ini
[global]
index-url = http://<Nexus_IP>:8081/repository/pypi-group/simple/
trusted-host = <Nexus_IP>
```

> `trusted-host` 是在使用 HTTP（而非 HTTPS）时必须配置的选项，告知 pip 信任该主机，否则会因 SSL 验证失败而报错。

---

## ✅ 第七步：验证安装

配置完成后，在内网开发机执行：

```bash
pip install -r d:\PyPI\requirements.txt
```

如果 pip 完全从内网 Nexus 拉取包且无任何网络错误，说明整套流程搭建成功 🎉

---

## 🐛 常见问题排查

| 问题现象 | 原因分析 | 解决方法 |
|----------|----------|----------|
| `SSL: CERTIFICATE_VERIFY_FAILED` | pip 把 HTTP 地址当 HTTPS 处理 | 确认 `pip.ini` 中 `trusted-host` 已正确填写 |
| 某些包 `404 Not Found` | 外网下载时平台/版本不匹配 | 确保跳板机与内网机的 Python 版本、操作系统完全一致后重新下载 |
| `+cu121` 后缀的 PyTorch 包找不到 | 未加 PyTorch 专属下载源 | `pip download` 时务必加 `--extra-index-url https://download.pytorch.org/whl/cu121` |
| twine 上传报 `403 Forbidden` | Nexus 用户权限不足 | 确认用户拥有 `nx-repository-view-pypi-pypi-local-*` 权限 |
| 内网 `pip install` 仍尝试访问外网 | `pip.ini` 未生效或路径错误 | 执行 `pip config list` 检查当前生效的配置项 |

---

## 📝 总结

整个流程的核心逻辑其实很清晰：

1. **跳板机**（有网）用 `pip download` 把所有依赖打包成文件
2. **U 盘/共享**把文件搬进内网
3. **Nexus** 作为私有仓库托管这些文件
4. **开发机**通过 `pip.ini` 把 Nexus 当作 PyPI 源使用

一次搭建，团队所有成员都能受益，后续新增依赖只需重复「下载 → 上传」两步即可。

有问题欢迎评论区交流 💬
