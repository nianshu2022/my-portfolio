---
title: 部署 OpenStack 云平台
date: 2022-10-25
description: 基于 CentOS 7.5 环境，详细记录从系统镜像准备、网络架构规划到各个核心组件（Keystone, Glance, Nova, Neutron, Dashboard）的安装与配置过程。
tags: [OpenStack, 运维, 云计算, CentOS]
---

## 1. 系统镜像

安装运行环境系统要求为 CentOS 7.5，内核版本不低于 3.10。

- CentOS-7.5-x86_64-DVD-1804.iso
- Chinaskill_Cloud_iaas.iso

## 2. 网络架构及硬件配置

| 主机名 | 内存 | 硬盘 1 | 硬盘 2 | IP 地址 (VMnet1) | IP 地址 (VMnet8) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| controller | 4G | 100G | 无 | 192.168.100.10 | 192.168.200.10 |
| compute | 4G | 100G | 200G | 192.168.100.20 | 192.168.200.20 |

## 3. 基础环境部署

### 3.1 配置映射、主机名、网络、关闭防火墙

**controller 节点和 compute 节点：**

修改 `/etc/hosts` 文件添加映射：

```bash
192.168.100.10 controller
192.168.100.20 compute
```

![](https://img-blog.csdnimg.cn/989138c544b243fbb69dd79b23ce40be.png?shadow=true)

#### 3.1.1 controller 节点

**修改主机名：**

```bash
hostnamectl set-hostname controller
```

**配置网络：**

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

![](https://img-blog.csdnimg.cn/eab5a78fd5a14c498ed7a0a07cef8a62.png?shadow=true)
![](https://img-blog.csdnimg.cn/e18d1bbd52464b258c94fd8a8612ec32.png?shadow=true)

**关闭防火墙及修改配置文件：**

```bash
[root@controller ~]# systemctl stop firewalld     # 关闭防火墙
[root@controller ~]# systemctl disable firewalld
[root@controller ~]# vi /etc/selinux/config
# SELINUX=enforcing 改为 disabled
[root@controller ~]# setenforce 0    # 立即生效
[root@controller ~]# getenforce
```

![](https://img-blog.csdnimg.cn/14b099d8efae4e5d99b9b916aa2248c0.png?shadow=true)

#### 3.1.2 compute 节点

**修改主机名：**

```bash
hostnamectl set-hostname compute
```

**配置网络：**

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

![](https://img-blog.csdnimg.cn/44e3c2e0a8c94949b47e257bd4c4a58f.png?shadow=true)
![](https://img-blog.csdnimg.cn/ba0ed1900cfe45f6a3fd1770c618c3ad.png?shadow=true)

**关闭防火墙及修改配置文件：**

```bash
[root@compute ~]# systemctl stop firewalld     # 关闭防火墙
[root@compute ~]# systemctl disable firewalld
[root@compute ~]# vi /etc/selinux/config
# SELINUX=enforcing 改为 disabled
[root@compute ~]# setenforce 0     # 立即生效
[root@compute ~]# getenforce
```

### 3.2 挂载镜像、配置 yum 源

#### 3.2.1 controller 节点

**上传 CentOS 7.5 镜像和 Chinaskills_Cloud_iaas.iso 镜像至 controller 节点。**

![](https://img-blog.csdnimg.cn/47d012e4734d4884a31fa0d590252be4.png?shadow=true)
![](https://img-blog.csdnimg.cn/f60d8ef478e84456b7e71e267fd0a49e.png?shadow=true)

**查看镜像是否已上传：**

![](https://img-blog.csdnimg.cn/f8c9ec47084049509569ed7addf5a967.png?shadow=true)

```bash
[root@controller ~]# mkdir /opt/{iaas,centos}       # 创建两个挂载镜像的文件夹
[root@controller ~]# mv /etc/yum.repos.d/CentOS-* /home       # 备份原 yum 源配置文件
[root@controller ~]# vi /etc/yum.repos.d/local.repo       # 创建本地 yum 源配置文件
```

`local.repo` 内容：

```ini
[iaas]
name=iaas
baseurl=file:///opt/iaas/iaas-repo
gpgcheck=0
enabled=1
[centos]
name=centos
baseurl=file:///opt/centos
gpgcheck=0
enabled=1
```

挂载镜像并更新 yum 源：

```bash
[root@controller ~]# mount -o loop /CentOS-7.5-x86_64-DVD-1804.iso /opt/centos
[root@controller ~]# mount -o loop /Chinaskill_Cloud_iaas.iso /opt/iaas

[root@controller ~]# yum clean all    # 清除 yum 缓存
[root@controller ~]# yum repolist     # 显示仓库
```

![](https://img-blog.csdnimg.cn/3348a313242c41dab685c8efe9b92303.png?shadow=true)

**搭建 FTP 服务器：**

```bash
[root@controller ~]# yum -y install vsftpd
[root@controller ~]# vi /etc/vsftpd/vsftpd.conf
# 添加 anon_root=/opt/
[root@controller ~]# systemctl restart vsftpd
[root@controller ~]# systemctl enable vsftpd
```

#### 3.2.2 compute 节点

```bash
[root@compute ~]# mv /etc/yum.repos.d/CentOS-* /home       # 备份原 yum 源配置文件
[root@compute ~]# vi /etc/yum.repos.d/local.repo       # 创建本地 yum 源配置文件
```

`local.repo` 内容：

```ini
[centos]
name=centos
baseurl=ftp://192.168.100.10/centos
gpgcheck=0
enabled=1
[iaas]
name=iaas
baseurl=ftp://192.168.100.10/iaas-repo
gpgcheck=0
enabled=1
```

更新 yum 源：

```bash
[root@compute ~]# yum clean all    # 清除 yum 缓存
[root@compute ~]# yum repolist     # 显示仓库
```

![](https://img-blog.csdnimg.cn/79d9774bfd094aa1a0ee2eee4c358823.png?shadow=true)
![](https://img-blog.csdnimg.cn/e450303ade1f4d6eb4f891f4b111580c.png?shadow=true)

### 3.3 计算节点分区

在 compute 节点上利用空白分区划分 2 个 100G 分区。

```bash
[root@compute ~]# fdisk /dev/sdb
欢迎使用 fdisk (util-linux 2.23.2)。

更改将停留在内存中，直到您决定将更改写入磁盘。
使用写入命令前请三思。

Device does not contain a recognized partition table
使用磁盘标识符 0x34bc5373 创建新的 DOS 磁盘标签。

命令(输入 m 获取帮助)：n
Partition type:
   p   primary (0 primary, 0 extended, 4 free)
   e   extended
Select (default p): 
Using default response p
分区号 (1-4，默认 1)：
起始 扇区 (2048-209715199，默认为 2048)：
将使用默认值 2048
Last 扇区, +扇区 or +size{K,M,G} (2048-209715199，默认为 209715199)：+25G
分区 1 已设置为 Linux 类型，大小设为 25 GiB

命令(输入 m 获取帮助)：n
Partition type:
   p   primary (1 primary, 0 extended, 3 free)
   e   extended
Select (default p): 
Using default response p
分区号 (2-4，默认 2)：
起始 扇区 (52430848-209715199，默认为 52430848)：
将使用默认值 52430848
Last 扇区, +扇区 or +size{K,M,G} (52430848-209715199，默认为 209715199)：+25G
分区 2 已设置为 Linux 类型，大小设为 25 GiB

命令(输入 m 获取帮助)：w
The partition table has been altered!

Calling ioctl() to re-read partition table.
正在同步磁盘。
[root@compute ~]# lsblk 
NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda               8:0    0  200G  0 disk 
├─sda1            8:1    0    1G  0 part /boot
└─sda2            8:2    0  199G  0 part 
  ├─centos-root 253:0    0   50G  0 lvm  /
  ├─centos-swap 253:1    0    2G  0 lvm  [SWAP]
  └─centos-home 253:2    0  147G  0 lvm  /home
sdb               8:16   0  100G  0 disk 
├─sdb1            8:17   0   25G  0 part 
└─sdb2            8:18   0   25G  0 part 
sr0              11:0    1  4.2G  0 rom  
```

![](https://img-blog.csdnimg.cn/f0162da1fcb34378ab44643f38734b7d.png?shadow=true)

### 3.4 编辑环境变量

**controller 和 compute 节点都要操作。**

编辑文件 `/etc/xiandian/openrc.sh`，此文件是安装过程中的各项参数，根据每项参数上一行的说明及服务器实际情况进行配置。

```bash
[root@controller ~]# yum -y install iaas-xiandian
[root@controller ~]# vi /etc/xiandian/openrc.sh

[root@compute ~]# yum -y install iaas-xiandian
[root@compute ~]# vi /etc/xiandian/openrc.sh
```

配置文件内容示例：

```bash
HOST_IP=192.168.100.10  # 控制节点IP地址
HOST_PASS=000000
HOST_NAME=controller    # 控制节点主机名
HOST_IP_NODE=192.168.100.20 # 计算节点IP地址
HOST_PASS_NODE=000000
HOST_NAME_NODE=compute  # 计算节点主机名
network_segment_IP=192.168.100.0/24
RABBIT_USER=openstack
RABBIT_PASS=000000
DB_PASS=000000
DOMAIN_NAME=demo
ADMIN_PASS=000000
DEMO_PASS=000000
KEYSTONE_DBPASS=000000
GLANCE_DBPASS=000000
GLANCE_PASS=000000
NOVA_DBPASS=000000
NOVA_PASS=000000
NEUTRON_DBPASS=000000
NEUTRON_PASS=000000
METADATA_SECRET=000000
INTERFACE_IP=192.168.100.x # 当前节点IP地址
INTERFACE_NAME=ens34    # 外部网络网卡名称
Physical_NAME=provider  # 外部网络适配器名称
minvlan=1               # vlan网络范围的第一个vlanID
maxvlan=1000            # vlan网络范围的最后一个vlanID
CINDER_DBPASS=000000
CINDER_PASS=000000
BLOCK_DISK=sdb1         # 计算节点第一块磁盘分区名
SWIFT_PASS=000000
OBJECT_DISK=sdb2        # 计算节点第二块磁盘分区名
STORAGE_LOCAL_NET_IP=192.168.100.20 # 计算节点IP地址
HEAT_DBPASS=000000
HEAT_PASS=000000
ZUN_DBPASS=000000
ZUN_PASS=000000
KURYR_DBPASS=000000
KURYR_PASS=000000
CEILOMETER_DBPASS=000000
CEILOMETER_PASS=000000
AODH_DBPASS=000000
AODH_PASS=000000
```

### 3.5 通过脚本安装服务

#### 3.5.1 执行脚本 iaas-pre-host.sh 进行安装

**controller 节点：**

安装完成后同时重启，重启后需重新挂载 iso 镜像。

```bash
[root@controller ~]# iaas-pre-host.sh
[root@controller ~]# reboot  # 重启
[root@controller ~]# mount -o loop CentOS-7-x86_64-DVD-1804.iso /opt/centos/
[root@controller ~]# mount -o loop chinaskills_cloud_iaas.iso /opt/iaas/
```

**compute 节点：**

```bash
[root@compute ~]# iaas-pre-host.sh
[root@compute ~]# reboot  # 重启
```

#### 3.5.2 MySQL 数据库服务

**controller 节点：**

```bash
[root@controller ~]# iaas-install-mysql.sh
```

#### 3.5.3 Keystone 认证服务

**controller 节点：**

```bash
[root@controller ~]# iaas-install-keystone.sh
```

#### 3.5.4 Glance 镜像服务

**controller 节点：**

```bash
[root@controller ~]# iaas-install-glance.sh
```

#### 3.5.5 Nova 计算服务

**controller 节点：**

```bash
[root@controller ~]# iaas-install-nova-controller.sh
```

**compute 节点：**

```bash
[root@compute ~]# iaas-install-nova-compute.sh 
```

#### 3.5.6 Neutron 网络服务

**controller 节点：**

```bash
[root@controller ~]# iaas-install-neutron-controller.sh
```

**compute 节点：**

```bash
[root@compute ~]# iaas-install-neutron-compute.sh
```

#### 3.5.7 Dashboard 服务

**controller 节点：**

```bash
[root@controller ~]# iaas-install-dashboard.sh
```

在浏览器中输入 `http://192.168.100.10/dashboard`

**注：检查防火墙规则，确保允许 HTTP 服务相关端口通行，或者关闭防火墙。**

- Domain：demo
- 用户名：admin
- 密码：000000

![](https://img-blog.csdnimg.cn/856c695ec52b442fb544229e6ae21851.png?shadow=true)

出现以下图示表示云平台搭建成功。

![](https://img-blog.csdnimg.cn/107733ea6750470e9f064fc3c1b7d7f0.png?shadow=true)

---

**附录：常用命令**

加载 admin 环境变量：

```bash
source /etc/keystone/admin-openrc.sh
```

上传镜像到 OpenStack 平台：

```bash
openstack image create --disk-format qcow2 --file /opt/cirros-0.3.4-x86_64-disk.img cirros
```
