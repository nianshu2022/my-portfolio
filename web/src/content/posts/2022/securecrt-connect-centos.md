---
title: 使用 SecureCRT 远程连接 CentOS 虚拟机
date: 2022-09-22
description: 配置 CentOS 7 网络适配器，设置静态 IP，关闭防火墙，并使用 SecureCRT 工具进行 SSH 远程连接。
tags: [SecureCRT, SSH, Linux, 运维, 工具]
---

## 1. 安装 SecureCRT

SecureCRT 是一款支持 SSH 等协议的终端仿真软件，可以在 Windows 下登录 Linux 服务器，这样大大方便了开发工作。安装 SecureCRT 可以通过网上的各种教程安装。

## 2. CentOS 设置

### 2.1 配置网卡

**controller 节点：**

配置网络：
修改 `BOOTPROTO=dhcp` （改为 `static`），`ONBOOT=no` （改为 `yes`）。

**ens33 添加：**

```ini
IPADDR=192.168.100.10
PREFIX=24
GATEWAY=192.168.100.1
```

**ens34 添加：**

```ini
IPADDR=192.168.200.10
PREFIX=24
```

![](https://img-blog.csdnimg.cn/cf17c9ec1f30472d9111fccd6b494ac2.png?shadow=true)
![](https://img-blog.csdnimg.cn/24ac11c2b7804408856fe3d8df14a25b.png?shadow=true)

**compute 节点：**

配置网络：
修改 `BOOTPROTO=dhcp` （改为 `static`），`ONBOOT=no` （改为 `yes`）。

**ens33 添加：**

```ini
IPADDR=192.168.100.20
PREFIX=24
GATEWAY=192.168.100.1
```

**ens34 添加：**

```ini
IPADDR=192.168.200.20
PREFIX=24
```

![](https://img-blog.csdnimg.cn/c62fe0edaa274b13a52ed71d4c101e9d.png?shadow=true)
![](https://img-blog.csdnimg.cn/c439722dd34b4170a85178fc9f182cfd.png?shadow=true)

为了之后方便使用工具远程连接 Linux 系统，这边我们把防火墙关了，也可以禁止防火墙，永久关闭这样重启虚拟机也可以直接用工具远程连接了。

**关闭防火墙及修改配置文件 ：controller 和 compute 都要做**

```bash
[root@controller ~]# systemctl stop firewalld
[root@controller ~]# systemctl disable firewalld
[root@controller ~]# vi /etc/selinux/config      
# SELINUX=enforcing 改为 disabled
[root@controller ~]# setenforce 0
[root@controller ~]# getenforce
```

![](https://img-blog.csdnimg.cn/9d9ff86652af45dc993153b99a60db30.png?shadow=true)

### 2.2 设置 VM 网络编辑器

![](https://img-blog.csdnimg.cn/301bac0bdd8942039132743080ea80be.png?shadow=true)
![](https://img-blog.csdnimg.cn/aadac14ca3734070a7abacc01ab554cd.png?shadow=true)

**注意：VMnet8 必须跟 controller 节点和 compute 节点在同一个网段才能连接上 SecureCRT。**

![](https://img-blog.csdnimg.cn/d37274f5dc524c24b94f76d415a3db52.png?shadow=true)

## 3. 使用 SecureCRT

使用 SecureCRT 连上 controller 节点。（注：连接 SecureCRT 是为了方便）

![](https://img-blog.csdnimg.cn/f270fb93469f4745ac9995ae795063f2.png?shadow=true)

输入密码后，点击“确定”即可连接上 SecureCRT。

![](https://img-blog.csdnimg.cn/dbb9965aacb848cc9726249132501a6e.png?shadow=true)

出现以下图示表示连接成功。

![](https://img-blog.csdnimg.cn/33273e439eab42e5bced6a4b5765f60b.png?shadow=true)
