---
title: "实录：手机跑通 Gemma 4 离线多模态大模型的踩坑笔记"
date: "2026-04-07"
description: "尝试在骁龙 8 Gen 2 手机上本地跑通 Gemma 4 多模态模型时遭遇 OOM 报错？本文记录了如何绕过官方解法的坑，利用 Termux 与 llama.cpp 在安卓端通过 4-bit 量化完美实现离线多模态推理的完整实录。"
tags: ["大模型", "多模态", "Gemma", "折腾实录", "Termux"]
---

> **前言**：我是念舒。这周末我基本没干别的事，全耗在刚发布的 Gemma 4 身上了。谁能抵挡住“最强开源本地多模态大模型”的诱惑呢？特别是谷歌这次强调它的低参数组（E2B / E4B）在手机设备上的极高可用性，这直接戳中了我这种喜欢把服务器往手机里塞的折腾党的心巴。
>
> 本以为是一场轻松的降维打击，没想到差点在安卓环境的内存墙面前撞得头破血流。本文记录了我是如何在一台骁龙 8 Gen 2 的安卓机上，从 `OUT_OF_MEMORY` 到最终完美跑通 Gemma 4 多模态推理的完整实录。

---

## 💥 阶段一：尝试官方解法，光速翻车

我使用的环境：
- **设备**：骁龙 8 Gen 2 备用机，8GB RAM
- **OS**：Android 14 (没有 Root)，利用 Termux 搭环境
- **模型目标**：Gemma 4 E2B Instruct (带 Vision 支持)

起初我过于相信 Google AI Edge Gallery 的傻瓜式部署。当我把官方的 `.tflite` (或者通用包) 拽进去尝试使能 Vision Adapter 时，终端直接爆炸：

> **`[Fatal Error] failed to allocate tensor buffer for Vision Encoder: OUT_OF_MEMORY system killed process...`**

这可真棒。Gemma 4 这次的原生多模态是非常深度的参数融合，但视觉编码器的启动瞬间会拉起一个超大内存池（大概 3.2GB+）。安卓系统有一个严苛的单应用内存限制（即使开了大内存分配），很容易在峰值阶段被 LMK (Low Memory Killer) 无情狙杀。

---

## 🛠️ 阶段二：保姆级重构，手把手带你在手机端补全环境

走傻瓜路线不行，那就回到底层逻辑。我要利用 `llama.cpp` 直接把模型量化版跑在手机上。下面是供大家直接复制的“无脑实操指南”。

### 🧱 步骤 1：安装 Termux 并配置基础环境

由于安卓各大应用商店的 Termux 基本都已停更，**强烈建议去 F-Droid 官网下载最新版 Termux**（否则会遇到无数 SSL 证书报错）。

打开 Termux，第一步先换源和更新系统包：

```bash
termux-change-repo # 选择清华源或中科大源即可
pkg update && pkg upgrade -y
```

接着，把我们编译需要的“全家桶”工具全装上：

```bash
pkg install clang cmake make git wget ndk-sysroot python -y
# 给 Termux 申请存储权限（执行后手机会弹窗，必须点“允许”）
termux-setup-storage
```

### 🔨 步骤 2：拉取最新 llama.cpp 源码并现场编译

Gemma 4 刚刚发布，相应的支持代码最近才合入主干，所以必须拉取最新版的仓库：

```bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
mkdir build && cd build
```

在安卓环境编译，不建议搞花里胡哨的复杂参数，直接用基础版命令进行稳定编译：

```bash
# 注意针对安卓 ARM 的专属参数优化
cmake .. -DCMAKE_BUILD_TYPE=Release -DLLAMA_STATIC=ON 
# 如果你的手机性能还行，可以开四线程加速编译
make -j4
```

> **🚨 踩坑提示**：编译到这里是最容易翻车的。手机内部存储至少要预留 3GB 以上空间，如果编译到 80% 突然断掉，大概率是因为空间满了！

---

## 📉 阶段三：扼杀 OOM 问题，准备 4-bit 量化模型

环境就绪，下一步是准备能跑在手机上的特制模型文件。

我们需要分别下载**主模型（被压缩为 4-bit 的 gguf 版）**和**视觉投影仪（mmproj 文件，负责多模态图像识别）**。在 Termux 里，我们直接通过 Python 的 HuggingFace 工具包拉取：

```bash
# 退回 llama.cpp 根目录，建一个 models 文件夹专门放权重
cd ../
mkdir models && cd models

# 安装 HuggingFace 官方拉取工具
pip install -U "huggingface_hub[cli]"

# 下载核心大模型（约 1.6 GB）
huggingface-cli download ggerganov/gemma4-e2b-it-gguf gemma4-e2b-it-q4_k_m.gguf --local-dir .

# 下载独立视觉模块文件（极其关键，没有它手机绝对不认识图）
huggingface-cli download ggerganov/gemma4-e2b-it-mmproj gemma4-mmproj-f16.gguf --local-dir .
```

---

## 🚀 阶段四：见证奇迹，启动本地多模态推理！

经过上述折腾，你的核心文件结构应该长这样：

```text
/llama.cpp
  ├── build/bin/llama-cli  (刚才手搓编译出来的引擎)
  ├── models/
      ├── gemma4-e2b-it-q4_k_m.gguf
      └── gemma4-mmproj-f16.gguf
```

接下来，我们去手机相册里随便拔一张图，拷贝到项目主目录下用来测试：

```bash
# 将相册里的一张照片拷贝过来，并重命名为 test.jpg 方便输入
cp ~/storage/shared/DCIM/Camera/IMG_test.jpg ../test.jpg
```

**深吸一口气，退回到 `build` 文件夹输入终极启动命令：**

```bash
cd ../build

./bin/llama-cli \
  -m ../models/gemma4-e2b-it-q4_k_m.gguf \
  --mmproj ../models/gemma4-mmproj-f16.gguf \
  --image ../test.jpg \
  -p "What's in this image? Explain carefully." \
  -c 2048 \
  -ngl 33
```

**参数白话解说：**
- `-m`：挂载千辛万苦弄到的主模型。
- `--mmproj`：必须挂载这玩意儿。视觉编码单独挂载不压榨主内存，是避开 OOM 的关键。
- `-c 2048`：强行限制上下文窗口大小。手机内存寸土寸金，写成 2048 或 4096 最稳，千万别贪心开 8K 甚至无限制，秒崩。
- `-ngl 33`：尽可能把神经网的运算丢给手机 GPU 卸载。

---

## 📝 总结

命令行短暂卡顿后，风扇没转，但后盖能感觉到发热。等待了大概 8 秒，这台离线的手机给了我回答：

> `"Based on the image provided, there is a mechanical keyboard on a wooden desk. The keycaps feature..."`

成了。真·手机本地多模态解析，没连一丁点网，全靠这块小板子硬算出来了。

这次折腾再次证明了一点：永远不要低估一块现代 SoC 的潜力，也不要高估大厂给的“官方新手指南”。这就是这次跑通 Gemma 4 离线版本的全记录。后续我会研究如何把这套逻辑打包在一个 Docker 容器或者独立 APP 里运行，敬请期待。

> **— 念舒的数字花园，极客手记 —**
