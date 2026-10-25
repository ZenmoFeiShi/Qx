# 美团去广告（Quantumult X）

作者：`TG@ZenMoFiShi`

适用于美团 12.67.403 当前链路。公开包只包含去广告脚本和最小 QX 配置，不包含主配置、证书、Cookie、HAR 或账号信息。

## 功能范围

- 删除底部 `video` 视频 Tab
- 删除底部 `xiaotuan` 小团 Tab
- 删除购物车顶部 `topBannerArea` 横幅
- 删除购物车 `gwc_feed1_2265` 瀑布流推荐
- 删除开屏 `startupPicArea`
- 不处理“我的”页面

## 使用

1. 导入 `MeiTuanNoAd.js` 和 `MeiTuanNoAd.snippet`。
2. 确认 Quantumult X 已安装并信任 MitM 根证书。
3. 重新加载重写，强杀美团后重新打开。

## 原理与限制

Shark 和 MQUIC 是美团私有网络通道，QX 无法直接改写其中的业务响应。snippet 通过精确阻断已确认的 Shark 入口和地址，促使相关请求回退到 HTTPS，再由脚本改写 JSON。IP 会随版本和地区变化；如果后续链路变更，需要重新核对，不要扩大封禁网段。

脚本遇到非 JSON、未知结构或异常时保持原响应放行。
