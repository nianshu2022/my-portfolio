---
title: VMware 安装 CentOS 7.5 操作系统
date: 2023-11-20
description: 详细图文教程，手把手教你在 VMware Workstation 中安装 CentOS 7.5 操作系统，包含网络配置与分区设置。
tags: [Linux, CentOS, VMware, 运维]
---

视频教程：[点击观看](https://live.csdn.net/v/236820)

## 1. 环境准备

准备实验所需要的环境，需要安装 VMware Workstation。使用的系统镜像为 `CentOS-7.5-x86_64-DVD-1804.iso`。

## 2. 网络架构及硬件配置

| 主机名 | 内存 | 硬盘 1 | 硬盘 2 | IP 地址 (VMnet1) | IP 地址 (VMnet8) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| controller | 4G | 100G | 无 | 192.168.100.10 | 192.168.200.10 |
| compute | 4G | 100G | 100G | 192.168.100.20 | 192.168.200.20 |

## 3. 基础环境准备及安装系统

### 3.1 controller 控制节点

![](https://img-blog.csdnimg.cn/c7c0aee9314a47dba7e9d6ef98545a65.png?shadow=true)
![](https://img-blog.csdnimg.cn/048e8e18580c4fa98c98319902a3eb77.png?shadow=true)
![](https://img-blog.csdnimg.cn/8ab574fc7e724be8a79112f8c4c6fd04.png?shadow=true)
![](https://img-blog.csdnimg.cn/777cd5316aa744c2a6fa0c698745c068.png?shadow=true)
![](https://img-blog.csdnimg.cn/550a664ff0e941b8834dac24bb9528dc.png?shadow=true)
![](https://img-blog.csdnimg.cn/4ec3f725db66437bb804f8614e6da2e3.png?shadow=true)
![](https://img-blog.csdnimg.cn/a583435cc5944e7a85ba4ff562fdd3ae.png?shadow=true)
![](https://img-blog.csdnimg.cn/1a05428261914da8bf141fb12ab84bad.png?shadow=true)
![](https://img-blog.csdnimg.cn/eafe026491bd4255a6a24970c5b439c5.png?shadow=true)
![](https://img-blog.csdnimg.cn/173d86fa80fe45819f845be5abfd9b76.png?shadow=true)
![](https://img-blog.csdnimg.cn/d6e4d309d5e646a0ac38aaa42a142152.png?shadow=true)
![](https://img-blog.csdnimg.cn/2cbfe6033e2e4c6db6d8ff337892776b.png?shadow=true)
![](https://img-blog.csdnimg.cn/c41da124e8444843b485d61a9bd477ca.png?shadow=true)
![](https://img-blog.csdnimg.cn/3678af1591624fcd8c809cdc132c459d.png?shadow=true)
![](https://img-blog.csdnimg.cn/2b20b6b9f2d2435987a4e8dde3602719.png?shadow=true)
![](https://img-blog.csdnimg.cn/1ec4b7523f3344d29bcad02ab55ac864.png?shadow=true)
![](https://img-blog.csdnimg.cn/ff06f330e7a147fca8c8ebce0d96a443.png?shadow=true)
![](https://img-blog.csdnimg.cn/61031a263dfb48d280212b5dfcdaffe3.png?shadow=true)
![](https://img-blog.csdnimg.cn/91cf5ce46dac4b4bb13c7c40a43c3ef2.png?shadow=true)
![](https://img-blog.csdnimg.cn/f6b3c4dea502434e863bf15ffb880ac3.png?shadow=true)
![](https://img-blog.csdnimg.cn/ac835f5efb194d40aae3f56bccefb52b.png?shadow=true)

### 3.2 compute 计算节点

说明：compute 节点与 controller 节点基础环境及安装系统大致相同，可参考 controller 节点配置，以下是稍有不同的地方：

![](https://img-blog.csdnimg.cn/3cdc82e3cd0f425d802ce919bf867449.png?shadow=true)
![](https://img-blog.csdnimg.cn/f37ee4f69cde47e09ae82f04c44d3be1.png?shadow=true)

![](https://img-blog.csdnimg.cn/fcbfb52d3c9f4920995891307692c49d.png?shadow=true)
![](https://img-blog.csdnimg.cn/e582a07b2d494c93a47864ae1b79d065.png?shadow=true)
