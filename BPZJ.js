//2025/5/13
/*
@Name：表盘专辑解锁🔓会员
@Author：怎么肥事
使用方法：打开重写进软件恢复购买
[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/BPZJ.js



[MITM]
hostname = buy.itunes.apple.com

*/
const newExpires = {
  "expires_date": "2088-05-15 15:02:02 Etc/GMT",
  "expires_date_pst": "2088-05-15 08:02:02 America/Los_Angeles",
  "expires_date_ms": "3775321322000"
};

const body = {
  "environment": "Production",
  "receipt": {
    "receipt_type": "Production",
    "app_item_id": 1454621179,
    "receipt_creation_date": "2025-05-12 15:02:03 Etc/GMT",
    "bundle_id": "indie.davidwang.WatchWallpaper",
    "original_purchase_date": "2025-05-12 14:55:41 Etc/GMT",
    "in_app": [
      {
        "quantity": "1",
        "purchase_date_ms": "1747062122000",
        "is_in_intro_offer_period": "true",
        "transaction_id": "310002290692115",
        "is_trial_period": "true",
        "original_transaction_id": "310002290692115",
        "purchase_date": "2025-05-12 15:02:02 Etc/GMT",
        "product_id": "indie.davidwang.WatchWallpaper.yearsubscriptegold.b",
        "original_purchase_date_pst": "2025-05-12 08:02:03 America/Los_Angeles",
        "in_app_ownership_type": "PURCHASED",
        "original_purchase_date_ms": "1747062123000",
        "web_order_line_item_id": "310001080793106",
        "purchase_date_pst": "2025-05-12 08:02:02 America/Los_Angeles",
        "original_purchase_date": "2025-05-12 15:02:03 Etc/GMT",
        ...newExpires
      }
    ],
    "adam_id": 1454621179,
    "receipt_creation_date_pst": "2025-05-12 08:02:03 America/Los_Angeles",
    "request_date": "2025-05-12 15:02:06 Etc/GMT",
    "request_date_pst": "2025-05-12 08:02:06 America/Los_Angeles",
    "version_external_identifier": 874041734,
    "request_date_ms": "1747062126289",
    "original_purchase_date_pst": "2025-05-12 07:55:41 America/Los_Angeles",
    "application_version": "1588",
    "original_purchase_date_ms": "1747061741000",
    "receipt_creation_date_ms": "1747062123000",
    "original_application_version": "1588",
    "download_id": 504497044869877708
  },
  "pending_renewal_info": [
    {
      "product_id": "indie.davidwang.WatchWallpaper.yearsubscriptegold.b",
      "original_transaction_id": "310002290692115",
      "auto_renew_product_id": "indie.davidwang.WatchWallpaper.yearsubscriptegold.b",
      "auto_renew_status": "1"
    }
  ],
  "status": 0,
  "latest_receipt_info": [
    {
      "quantity": "1",
      "purchase_date_ms": "1747062122000",
      "is_in_intro_offer_period": "true",
      "transaction_id": "310002290692115",
      "is_trial_period": "true",
      "original_transaction_id": "310002290692115",
      "purchase_date": "2025-05-12 15:02:02 Etc/GMT",
      "product_id": "indie.davidwang.WatchWallpaper.yearsubscriptegold.b",
      "original_purchase_date_pst": "2025-05-12 08:02:03 America/Los_Angeles",
      "in_app_ownership_type": "PURCHASED",
      "subscription_group_identifier": "20610050",
      "original_purchase_date_ms": "1747062123000",
      "web_order_line_item_id": "310001080793106",
      "purchase_date_pst": "2025-05-12 08:02:02 America/Los_Angeles",
      "original_purchase_date": "2025-05-12 15:02:03 Etc/GMT",
      ...newExpires
    }
  ],
  "latest_receipt": "FAKE_BASE64=="
};

$done({ body: JSON.stringify(body) });
