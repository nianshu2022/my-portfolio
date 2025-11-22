---
title: "企业微信实现情侣每日定时推送全攻略！"
date: "2024-03-04"
description: "教你如何利用企业微信API和Python脚本，搭建一个专属的情侣每日定时推送服务，包含天气、纪念日等功能。"
tags: ["Python", "企业微信", "自动化", "教程"]
---

## 注册企业微信

企业微信：https://open.work.weixin.qq.com/wwopen/login

1.  注册  
    ![jJVPySQxv8kFesq.png](https://s2.loli.net/2024/03/04/jJVPySQxv8kFesq.png)
    
2.  填写相关信息，点击“注册”  
    ![je1fkNg6OXPx3iI.png](https://s2.loli.net/2024/03/04/je1fkNg6OXPx3iI.png)
    
3.  登录企业微信后台，点击“创建应用”  
    ![wmRJGBiE2jLzpeP.png](https://s2.loli.net/2024/03/04/wmRJGBiE2jLzpeP.png)
    
4.  填写应用的头像、应用名称和选择可见范围，点击“创建应用”  
    ![tISfraBupkh3TAW.png](https://s2.loli.net/2024/03/04/tISfraBupkh3TAW.png)
    

5.点击查看，企业微信收到消息，查看agentld  
![1DNz3fEkjTR2QXy.png](https://s2.loli.net/2024/03/04/1DNz3fEkjTR2QXy.png)

6.  填写企业可信IP

- 比如使用我自己的电脑运行推送程序，那么就要直接填写百度里面IP的结果即可，或者直接点击查询IP的链接（点此查询IP）
- 比如用云服务器运行推送程序，那么就需要填写服务器的IP地址  
    ![TqX2MsWFmNlwajH.png](https://s2.loli.net/2024/03/04/TqX2MsWFmNlwajH.png)

7.  点击“我的企业”，获取企业ID  
    ![vXsUhQJDPEFbRCW.png](https://s2.loli.net/2024/03/04/vXsUhQJDPEFbRCW.png)
    
8.  点击“微信插件”，微信扫码关注，接收消息  
    ![JOpe6i2cdXHbl9q.png](https://s2.loli.net/2024/03/04/JOpe6i2cdXHbl9q.png)
    

## 申请和风天气Key

1.  注册  
    和平天气官方：https://id.qweather.com/#/login
    
2.  点击“开发服务控制台”  
    ![vAFWCm8Kyp3Igrj.png](https://s2.loli.net/2024/03/04/vAFWCm8Kyp3Igrj.png)
    
3.  点击“项目管理”，创建项目  
    ![gfVzM7lDIRyPhe4.png](https://s2.loli.net/2024/03/04/gfVzM7lDIRyPhe4.png)
    
4.  输入应用名称 -> Web API -> 输入KEY名称 -> 完成创建，保存好KEY，后面会用到  
    ![MpNPARyXQ1HelUt.png](https://s2.loli.net/2024/03/04/MpNPARyXQ1HelUt.png)
    

## 部署程序

1. 源文件  

下载网址：https://download.csdn.net/download/qq_52716296/88906655

2. 修好配置文件config.py

```py
import os
SYS_CONFIG = {
    # 企业微信企业ID,必填 申请地址：https://work.weixin.qq.com/
    "wxid": "wxxxxxxxd",
    # 企业微信AgentId,必填
    "agentid": 1000002,
    # 企业微信应用Secret,必填
    "secret": "MaqsxxxxxxxxxxxxxOxLWKlgt8",
    # 和风天气Key，非必填 申请地址： https://id.qweather.com/#/login
    "qweather": "6c5d655xxxxxxxxxxxxx66bb1305",
    # 天气预报地址，非必填
    # 格式：市-市/县/区，多地址以&&分隔
    # 如：兰州-城关&&兰州-榆中
    "city": "兰州-城关",
    # 纪念日名称，非必填
    # 周期性日子，每年都有的日子，多个日期以&&分隔
    # 如：女朋友的生日&&我的的生日
    "targetname": "xxx的生日&&xxx的生日",
    # 纪念日日期，非必填
    # 公历格式20XX-XX-XX，农历年份前加n
    # 多日期以&&分隔，注意与targetname名称对应
    # 如：2022-08-10&&n2021-08-15
    "targetday": "2001-04-19&&n2001-02-05",
    # 单日项目名称，非必填
    # 只发生一次的日子，只有某一年有的日子，多日期以&&分隔
    # 如：在一起&&见面
    "beginname": "我们在一起",
    # 单日日期，非必填
    # 公历格式20XX-XX-XX，农历年份前加n
    # 多日期以&&分隔，注意与beginname名称对应
    # 如：2022-08-15&&n2022-12-10
    "beginday": "2022-06-16",
    # 图文类型，非必填
    # 1为单图文，2为多图文，默认单图文
    "msgtype": "1"
}
```

3.修改图片地址，打开index.py

```py
#第37行
def get_pic():
    try:
        # 选择输出分类[meizi|dongman|fengjing|suiji]，为空随机输出
        pic_url = "https://s2.loli.net/2024/02/03/a4IfCODiPo9UhNM.jpg"
        r = requests.get(pic_url).json()
        return r["imgurl"]
    except Exception as e:
        print("获取随机图片数据出错,请稍后重试，若多次重试不行请关注微信公众号【偶尔栖息】聊天反馈", e)
        return None
```

```py
#第86行
def get_bing():
    bing_pic = "https://s2.loli.net/2024/02/03/a4IfCODiPo9UhNM.jpg"
    bing_title = "⏰起床啦！"
    bing_content = "This is a custom wallpaper provided by the user."
    bing_tip = bing_title + " — " + bing_content
    return {
        "bing_pic": bing_pic,
        "bing_title": bing_title,
        "bing_content": bing_content,
        "bing_tip": bing_tip
    }
```

## 运行程序

1.  将程序上传服务器
- 手动执行测试  
    ![E1PtRSmHXO2shzb.png](https://s2.loli.net/2024/03/04/E1PtRSmHXO2shzb.png)

2.  添加定时任务,每天7点执行
```shell
0 7 * * * python3 /root/project/zaoan/src/index.py
```

3.  微信收到推送消息  
    ![mobile-screenshot](https://s2.loli.net/2025/11/22/qU2JovZltTed6An.png)
