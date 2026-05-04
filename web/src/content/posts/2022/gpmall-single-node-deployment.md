---
title: GPMall 商城单节点部署实战
date: 2022-08-02
description: 基于 CentOS 7 环境，从零开始部署 GPMall 商城系统。涵盖 Java、Redis、Elasticsearch、Nginx、MariaDB、ZooKeeper、Kafka 等组件的安装与配置。
tags: [GPMall, 运维, 部署, CentOS, 中间件]
---

## 1. 修改主机名

```bash
[root@localhost ~]# hostnamectl set-hostname mall
```

## 2. 修改 /etc/hosts 配置文件

```bash
[root@mall ~]# vi /etc/hosts
192.168.100.10 mall
```

## 3. 配置本地 yum 源

将 `gpmall-repo` 上传到服务器的 `/opt` 目录下，并配置本地 `local.repo` 文件。

```bash
mkdir -p /opt/centos
mount /dev/cdrom /opt/centos
[root@mall ~]# vi /etc/yum.repos.d/local.repo
```

```ini
[centos]
name=centos
baseurl=file:///opt/centos
gpgcheck=0
enabled=1
[mall]
name=mall
baseurl=file:///opt/gpmall-repo
gpgcheck=0
enabled=1
```

## 4. 安装基础服务

### 4.1 安装 Java 环境

```bash
[root@mall ~]# yum install -y java-1.8.0-openjdk java-1.8.0-openjdk-devel
[root@mall ~]# java -version
```

### 4.2 安装 Redis 缓存服务

```bash
[root@mall ~]# yum install redis -y
```

### 4.3 安装 Elasticsearch 服务

```bash
[root@mall ~]# yum install elasticsearch -y
```

### 4.4 安装 Nginx 服务

```bash
[root@mall ~]# yum install nginx -y
```

### 4.5 安装 Mariadb 服务

```bash
[root@mall ~]# yum install mariadb mariadb-server -y
```

### 4.6 安装 ZooKeeper 服务

将 `zookeeper-3.4.14.tar.gz` 上传至云主机的 `/opt` 内，解压压缩包命令如下：

```bash
[root@mall ~]# tar -zxvf zookeeper-3.4.14.tar.gz
```

进入到 `zookeeper-3.4.14/conf` 目录下，将 `zoo_sample.cfg` 文件重命名为 `zoo.cfg`，命令如下：

```bash
[root@mall conf]# mv zoo_sample.cfg zoo.cfg
```

进入到 `zookeeper-3.4.14/bin` 目录下，启动 ZooKeeper 服务，命令如下：

```bash
 ./zkServer.sh start
```

查看 ZooKeeper 状态，命令如下：

```bash
./zkServer.sh status
```

### 4.7 安装 Kafka 服务

将提供的 `kafka_2.11-1.1.1.tgz` 包上传到云主机的 `/opt` 目录下，解压该压缩包，命令如下：

```bash
tar -zxvf kafka_2.11-1.1.1.tgz
```

进入到 `kafka_2.11-1.1.1/bin` 目录下，启动 Kafka 服务。

使用 `jps` 命令查看 Kafka 是否成功启动，命令如下：

```bash
[root@mall bin]# jps
6039 Kafka
1722 QuorumPeerMain
6126 Jps
```

## 5. 启动服务

### 5.1 启动数据库并配置

修改数据库配置文件并启动 MariaDB 数据库，设置 root 用户密码为 `123456`，并创建 `gpmall` 数据库，将提供的 `gpmall.sql` 导入。

修改 `/etc/my.cnf` 文件，添加字段如下所示：

```ini
[mysqld]
init_connect='SET collation_connection = utf8_unicode_ci'
init_connect='SET NAMES utf8'
character-set-server=utf8
collation-server=utf8_unicode_ci
skip-character-set-client-handshake
```

启动数据库：

```bash
[root@mall ~]# systemctl start mariadb
```

### 5.2 初始化数据库

设置 root 用户的密码为 `123456` 并登录：

```bash
[root@mall ~]# mysql_secure_installation
# ... (省略部分输出)
Enter current password for root (enter for none):    # 默认按回车
OK, successfully used password, moving on...
Set root password? [Y/n] y
New password:              # 输入数据库root密码123456
Re-enter new password:     # 重复输入密码123456
Password updated successfully!
# ... (一路按 y)
Thanks for using MariaDB!

[root@mall ~]# mysql -uroot –p123456
```

设置 root 用户的权限，命令如下：

```sql
MariaDB [(none)]> grant all privileges on *.* to root@localhost identified by '123456' with grant option;
Query OK, 0 rows affected (0.001 sec)
MariaDB [(none)]> grant all privileges on *.* to root@"%" identified by '123456' with grant option;
Query OK, 0 rows affected (0.001 sec)
```

将 `gpmall.sql` 文件上传至云主机的 `/root` 目录下。创建数据库 `gpmall` 并导入 `gpmall.sql` 文件：

```sql
MariaDB [(none)]> create database gpmall;
MariaDB [(none)]> use gpmall;
MariaDB [mall]> source /root/gpmall.sql
```

退出数据库并设置开机自启：

```sql
MariaDB [mall]> exit;
```

```bash
[root@mall ~]# systemctl enable mariadb
```

### 5.3 启动 Redis 服务

修改 Redis 配置文件，编辑 `/etc/redis.conf` 文件。
将 `bind 127.0.0.1` 这一行注释掉。
将 `protected-mode yes` 改为 `protected-mode no`。

启动 Redis 服务命令如下：

```bash
[root@mall ~]# systemctl start redis
[root@mall ~]# systemctl enable redis
```

配置 Elasticsearch 服务并启动：

```bash
[root@mall ~]# vi /etc/elasticsearch/elasticsearch.yml
```

在文件最上面加入 3 条语句如下：

```yaml
http.cors.enabled: true
http.cors.allow-origin: "*"
http.cors.allow-credentials: true
```

将如下 4 条语句前的注释符去掉，并修改 `network.host` 的 IP 为本机 IP：

```yaml
cluster.name: my-application
node.name: node-1
network.host: 192.168.94.1
http.port: 9200
```

最后修改完之后保存退出。然后启动 Elasticsearch 并设置开机自启，命令如下：

```bash
[root@mall ~]# systemctl start elasticsearch
[root@mall ~]# systemctl enable elasticsearch
```

### 5.4 启动 Nginx 服务

```bash
[root@mall ~]# systemctl start nginx
[root@mall ~]# systemctl enable nginx
```

## 6. 全局变量配置

修改 `/etc/hosts` 文件：

```bash
[root@mall ~]# vi /etc/hosts
192.168.100.10 kafka.mall
192.168.100.10 mysql.mall
192.168.100.10 redis.mall
192.168.100.10 zookeeper.mall
```

## 7. 部署前端

将 `dist` 目录上传至服务器的 `/root` 目录下。接着 `dist` 目录下的文件，复制到 Nginx 默认项目路径（首先清空默认路径下的文件）：

```bash
[root@mall ~]# rm -rf /usr/share/nginx/html/*
[root@mall ~]# cp -rvf dist/* /usr/share/nginx/html/
```

修改 Nginx 配置文件 `/etc/nginx/conf.d/default.conf`，添加映射如下所示：

```nginx
[root@mall ~]# vi /etc/nginx/conf.d/default.conf
server {
    listen       80;
    server_name  localhost;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }
    location /user {
            proxy_pass http://127.0.0.1:8082;
        }

    location /shopping {
            proxy_pass http://127.0.0.1:8081;
        }

    location /cashier {
            proxy_pass http://127.0.0.1:8083;
        }
    #error_page  404              /404.html;
}
```

重启 Nginx 服务，命令如下：

```bash
[root@mall ~]# systemctl restart nginx
```

## 8. 部署后端

将提供的 4 个 jar 包上传到服务器的 `/root` 目录下，并启动，启动命令如下：

```bash
[root@mall gpmall]# nohup java -jar shopping-provider-0.0.1-SNAPSHOT.jar &
# 按回车
[1] 6432
[root@mall gpmall]# nohup: ignoring input and appending output to ‘nohup.out’
# 按回车
[root@mall gpmall]# nohup java -jar user-provider-0.0.1-SNAPSHOT.jar &
[2] 6475
[root@mall gpmall]# nohup: ignoring input and appending output to ‘nohup.out’
# 按回车
[root@mall gpmall]# nohup java -jar gpmall-shopping-0.0.1-SNAPSHOT.jar &
[3] 6523
[root@mall gpmall]# nohup: ignoring input and appending output to ‘nohup.out’
# 按回车
[root@mall gpmall]# nohup java -jar gpmall-user-0.0.1-SNAPSHOT.jar &
[4] 6563
[root@mall gpmall]# nohup: ignoring input and appending output to ‘nohup.out’
# 按回车
```

按照顺序运行 4 个 jar 包之后，后端部署完成。

## 9. 网站访问

打开浏览器，在地址栏输入 `http://192.168.100.10`，访问界面。
