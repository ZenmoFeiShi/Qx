# ZenmoFeiShi / Qx

Quantumult X 脚本与重写规则合集，覆盖签到、净化、解锁等实用场景。

[![Stars](https://img.shields.io/github/stars/ZenmoFeiShi/Qx?style=flat-square)](https://github.com/ZenmoFeiShi/Qx/stargazers)
[![Forks](https://img.shields.io/github/forks/ZenmoFeiShi/Qx?style=flat-square)](https://github.com/ZenmoFeiShi/Qx/network/members)
[![License](https://img.shields.io/badge/license-Personal%20Use-lightgrey?style=flat-square)](#disclaimer)

## 使用方式

1. 打开 Quantumult X → 资源解析器 / 配置文件
2. 添加对应 `raw.githubusercontent.com` 链接，或直接导入 `.snippet` 规则
3. 开启 MITM 并按脚本注释完成一次手动操作以获取凭证（如有）

脚本头部通常包含：

```text
[rewrite_local]
[task_local]
[mitm]
```

## 脚本目录

### 签到 / 自动化

| 脚本 | 说明 |
|---|---|
| `CalShot.js` | CalShot 每日打卡 |
| `hongze.js` | 洪泽论坛每日签到（多账号） |
| `mixc_signin.js` | 一点万象 App 自动签到 |
| `Nodeseek_NsCheckin.js` | NS 论坛签到 |
| `PingMe.js` | PingMe 签到 + 视频奖励 |
| `WeTalk.js` | WeTalk 签到 + 视频奖励 |
| `QQMusic.js` | QQ 音乐绿钻成长值签到 |
| `LKXDYF.js` | 老百姓大药房小程序 |
| `SLY.js` | 随乐游公众号 |

### 净化 / 去广告

| 脚本 | 说明 |
|---|---|
| `bili_view_ad.js` / `bili_view_ad_rewrite.snippet` | B 站 gRPC 数据包净化 |
| `WB.snippet` | 微博净化 |
| `Soul.snippet` | Soul 净化 |
| `Keep.snippet` | Keep 净化 |
| `Smzdm.snippet` | 什么值得买净化 |
| `HP.snippet` | 虎扑净化 |
| `KuAn.snippet` | 酷安全面净化 |
| `TB.snippet` | 贴吧净化 |
| `TH.snippet` | 途虎养车净化 |
| `SF.snippet` | 顺丰 App 净化 |
| `Pinduoduo.snippet` | 拼多多页面布局净化 |
| `Didichuxing.snippet` | 滴滴出行 |
| `T3.snippet` | T3 出行 |
| `Cwkj.snippet` | 畅玩空间 |
| `hlwxx_remove_ads.js` / `hlwxx_remove_ads.snippet` | 黑料不打烊净化 |
| `TilingSales_ad_remove.snippet` | 瓜子影视净化 |
| `TilingSales_getNav.js` | 瓜子影视导航净化 |
| `WxPureDominion.snippet` | 微信相关净化 |
| `Youtube.snippet` / `youtube.response.js` | YouTube 去广告 / 隐藏 Shorts |
| `Yt-zh.snippet` / `yt-zh-sub.js` / `yt-sub-clean.js` | YouTube 强制简体中文字幕 |

### 解锁 / 会员相关

| 脚本 | 说明 |
|---|---|
| `BPZJ.js` | 表盘专辑解锁会员 |
| `MTB.js` | 磨题帮解锁会员 |
| `mgtv_vip.js` / `mgtv_vip.snippet` | 芒果 TV 解锁会员 |
| `migu_vip.js` / `migu_vip_share.snippet` | 咪咕视频解锁会员 |
| `gyrfalcon_unlock.js` | GyrfalconVPN 解锁 VIP 节点 |
| `xzimu-unlock.js` / `xzimu-unlock.snippet` | X 字幕无限翻译次数 |
| `xTerm256.snippet` | xTerm256 调试解锁会员 |
| `MeiTuanNoAd.js` | 美团相关处理 |

### Task 任务

| 脚本 | 说明 |
|---|---|
| `TaskHotBiliVideo.js` | B 站星榜全网热播 |

## 订阅示例

```text
https://raw.githubusercontent.com/ZenmoFeiShi/Qx/main/<脚本文件名>
```

例如：

```text
https://raw.githubusercontent.com/ZenmoFeiShi/Qx/main/CalShot.js
https://raw.githubusercontent.com/ZenmoFeiShi/Qx/main/Soul.snippet
```

## 说明

- 仅供学习与自用，请勿用于商业或传播破解用途
- 接口变更可能导致脚本失效，失效时以最新抓包结果为准
- 使用前请确认 QX 已正确配置 MITM、重写与任务

## 相关仓库

- [Reject-AD](https://github.com/ZenmoFeiShi/Reject-AD) — 通用广告拦截规则
- [Forward](https://github.com/ZenmoFeiShi/Forward) — Forward 播放器榜单组件

## Author

[@ZenmoFeiShi](https://github.com/ZenmoFeiShi)
