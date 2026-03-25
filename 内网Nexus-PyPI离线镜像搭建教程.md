# 内网 Nexus Repository 离线 PyPI 镜像搭建教程

> **适用场景**：Nexus 服务器与开发机均处于物理隔离内网，无法访问外网。  
> **操作系统**：Windows  
> **工具要求**：外网跳板机需安装与内网开发机**相同版本的 Python**。

---

## 一、在 Nexus 中创建仓库

登录 Nexus 管理后台（默认地址 `http://<Nexus_IP>:8081`），依次创建以下仓库：

进入 **Repository → Repositories → Create repository**：

| 步骤 | 仓库类型 | 建议名称 | 关键配置 |
|------|----------|----------|----------|
| 1 | PyPI (hosted) | `pypi-local` | 用于接收手动上传的离线包 |
| 2 | PyPI (group) | `pypi-group` | 成员仅加入 `pypi-local`；对外统一暴露此地址 |

> 如果未来 Nexus 恢复联网，可再添加 `pypi-proxy` 代理仓库到 group 中，实现自动拉取 + 本地缓存。

---

## 二、在外网跳板机下载离线包

在一台**能访问公网**、且 Python 版本与内网开发机相同的 Windows 机器上执行：

```bash
# 进入存放 requirements.txt 的目录
cd d:\PyPI

# 下载项目依赖（含 PyTorch CUDA 专属包），保存至 offline_packages 文件夹
pip download -r requirements.txt -d ./offline_packages --extra-index-url https://download.pytorch.org/whl/cu121

# 顺带下载上传工具 twine 及其全部依赖
pip download twine -d ./offline_packages
```

执行完毕后，`d:\PyPI\offline_packages` 目录中将包含 `.whl` / `.tar.gz` 格式的所有离线安装包。

---

## 三、将离线包拷入内网

将 `offline_packages` 整个文件夹通过 U 盘或内网文件共享拷贝到内网机器。

---

## 四、在内网机安装 twine

在内网机上打开命令行，进入 `offline_packages` 所在目录：

```bash
pip install --no-index --find-links=.\offline_packages twine
```

---

## 五、批量推送离线包至 Nexus

使用 `twine` 将 `offline_packages` 中的所有包一次性上传到 Nexus `pypi-local` 仓库：

```bash
twine upload ^
  --repository-url http://<Nexus_IP>:8081/repository/pypi-local/ ^
  -u <Nexus用户名> ^
  -p <Nexus密码> ^
  .\offline_packages\*
```

> **说明**：上传完成后 Nexus 会自动重建索引，稍等片刻即可在界面中看到包列表。

---

## 六、配置开发机的 pip 指向内网 Nexus

在 Windows 上，`pip` 的配置文件路径为：

```
%APPDATA%\pip\pip.ini
```

如不存在则新建，写入以下内容（将 `<Nexus_IP>` 替换为实际 IP）：

```ini
[global]
index-url = http://<Nexus_IP>:8081/repository/pypi-group/simple/
trusted-host = <Nexus_IP>
```

---

## 七、验证安装

配置完成后，在内网开发机执行：

```bash
pip install -r d:\PyPI\requirements.txt
```

pip 将完全从内网 Nexus 拉取包，无需任何外网访问。

---

## 附录：常见问题

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| `pip` 报 `SSL: CERTIFICATE_VERIFY_FAILED` | HTTP 被当作 HTTPS | 确认 `pip.ini` 中 `trusted-host` 已正确填写 |
| 某些包 404 Not Found | 外网下载时平台不匹配 | 确保跳板机与内网机的 Python 版本、操作系统完全一致后重新下载 |
| `+cu121` 后缀的 PyTorch 包找不到 | 未加 PyTorch 专属下载源 | `pip download` 时务必加 `--extra-index-url https://download.pytorch.org/whl/cu121` |
| twine 上传报 `403 Forbidden` | 权限不足 | 确认 Nexus 用户拥有 `nx-repository-view-pypi-pypi-local-*` 权限 |
