/*
@Name：磨题帮解锁🔓会员
@Author：怎么肥事
使用方法：打开重写进软件，退出登录再重新登录
[rewrite_local]
^https:\/\/motibang\.com:8001\/api\/1\/user\/info url script-response-body 1.js

[MITM]
hostname = motibang.com
*/
let obj = JSON.parse($response.body);

obj.vip_plan = 1;
obj.vip_days_left = 999;
obj.is_paid = 1;
obj.is_individual_vip = 1;
obj.had_been_paid = 1;

$done({ body: JSON.stringify(obj) });