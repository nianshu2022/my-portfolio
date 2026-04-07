---
title: "监控疯狂报警：我是怎么干掉 /var/lib/docker 几十G垃圾的"
date: "2026-04-07"
description: "测试或 CI/CD 节点频发 /var/lib/docker/ 磁盘 100% 爆满告警？千万别手欠用 rm -rf！本文记录了一套基于 Docker 官方命令和系统调用的极客无感排错范式与自动化清理脚本。"
tags: ["Docker", "Linux", "运维", "故障排查", "Shell"]
---

> **前言**：近期发现测试型与 CI/CD 宿主节点频发磁盘 100% 爆满告警，排查结果大多集中于 `/var/lib/docker/` 里的悬空镜像和持久化堆积的 `*-json.log` 容器标准输出文件。
>
> 很多新手面对这种情况非常容易直接执行全盘 `rm -rf`，但这将直接导致宿主侧文件与 Docker Daemon 内存里的 Graph driver 驱动元数据严重不同步，引发启动锁定及文件系统崩溃等次生灾害。以下为极客无感排错范式记录，希望能帮到被磁盘告警折磨的朋友 🤗

---

## 🔍 阶段一：透视与诊断

禁止使用普通的 Linux `du` 命令死磕深层目录！请使用 Docker 暴露的资源视图。

```bash
# 查看镜像层、激活体积、本地数据卷占用及明确的可回收 (Reclaimable) 比例
docker system df -v
```

---

## 🗑️ 阶段二：官方级垃圾回收

如果确准业务节点无需存留未运行的历史镜像，请使用此安全指令组合：

```bash
# 安全等级高：仅清理停止的容器、未被引用容器网络、及悬空的(Dangling)无标签镜像
docker system prune

# 刮骨疗毒级：增加 -a 清除一切没有正被关联的容器层镜像（警告：这包含有用的冷备应用环境镜像）
docker system prune -a --volumes -f
```

---

## 📉 阶段三：日志膨胀溢出抑制

对于无法设置全局日志大小滚动策略（log-opt max-size）的存量老机器，手动拦截清理是必要动作：

第一步，抓出体量最大的元凶并排序输出：

```bash
docker ps -q | xargs -I {} docker inspect --format="{{.LogPath}}" {} | xargs ls -lh | sort -h
```

第二步，利用系统调用而非删除行为执行原地归零清空：

```bash
# 这是运维规范核心：千万不能 rm 日志文件。正在运行的宿主进程依然持有原Inode的文件描述符，rm释放不了资源
cat /dev/null > /var/lib/docker/containers/xxx/xxx-json.log
```

---

## 🛠️ 附录：服务器极客专属清理 Shell 脚本 

直接通过 Crontab 进行日常注入定时触发（建议配合每天凌晨检测），阈值自定义在 80% 触发自卫防爆。将以下代码保存为 `docker_cleaner.sh` 并赋予执行权限。

```bash
#!/bin/bash
# Nianshu's Geek ToolBox: Docker 维护守卫者

THRESHOLD=80
PARTITION="/"
LOG_FILE="/var/log/docker_cleanup.log"

USE_PERCENT=$(df -h $PARTITION | awk 'NR==2 {print $5}' | sed 's/%//')

if [ "$USE_PERCENT" -gt "$THRESHOLD" ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') - [警告] 磁盘超过阈值达 $USE_PERCENT%. 开始执行安全扫盘..." >> $LOG_FILE
    
    # 强制清理未挂载闲置卷与常规无用游离数据
    docker system prune --volumes -f >> $LOG_FILE
    
    # 暴力但极速定位：强制截断所有大于500M的日志，实现不断服清理
    find /var/lib/docker/containers/ -type f -name "*.log" -size +500M -exec truncate -s 0 {} \;
    
    echo "$(date '+%Y-%m-%d %H:%M:%S') - [结束] Docker瘦身完毕。" >> $LOG_FILE
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') - [日常] 磁盘状态一切良好 ($USE_PERCENT%)." >> $LOG_FILE
fi
```

---

## 📝 总结

对于 Docker `/var/lib/docker`（特别是 `overlay2` 和 `containers` 目录）爆满的情况：

1. **绝对不要暴力 rm**：清理必须通过 Docker 自身命令或是系统工具的就地截断（`truncate` 或重定向），保证底层元数据强一致性。
2. **根治策略**：未来部署新节点时，建议在 `/etc/docker/daemon.json` 配好 `log-driver` 和 `log-opts` 的大小与滚动策略。  