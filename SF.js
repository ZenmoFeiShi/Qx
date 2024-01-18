// 2024-01-18 18:30
$task.fetch({
  url: 'https://ccsp-egmas.sf-express.com/cx-app-video/video/app/video/labelClusterList',
  method: 'GET',
  handler: function (response) {
    $done();
  }
});

$task.fetch({
  url: 'https://ucmp.sf-express.com/proxy/esgcempcore/memberGoods/pointMallService/goodsList',
  method: 'GET',
  handler: function (response) {
    $done();
  }
});

$task.fetch({
  url: 'https://ccsp-egmas.sf-express.com/cx-app-base/base/app/ad/queryInfoFlow',
  method: 'GET',
  handler: function (response) {
    $done();
  }
});

$task.fetch({
  url: 'https://ccsp-egmas.sf-express.com/cx-app-base/base/app/bms/queryRecommend',
  method: 'GET',
  handler: function (response) {
    $done();
  }
});
