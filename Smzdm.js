// 2024-02-11 01:02
const url = $request.url;
const body = $response.body;

const recursivelyFilterByCellType = (data) => {
  if (Array.isArray(data)) {
    return data.map(recursivelyFilterByCellType).filter(Boolean);
  } else if (typeof data === 'object' && data !== null) {
    if (data.cell_type === '23008' || data.cell_type === '23005') {
      return null;
    }
    Object.keys(data).forEach((key) => {
      data[key] = recursivelyFilterByCellType(data[key]);
    });
  }
  return data;
};

const fixPos = (arr) => {
  arr.forEach((item, index) => {
    item.pos = index + 1;
  });
};

const deleteProperties = (paths) => {
  paths.forEach((path) => {
    if (getObjectAtPath(obj, path)) {
      deleteObjectAtPath(obj, path);
    }
  });
};

const getObjectAtPath = (obj, path) => {
  return path.split('.').reduce((o, p) => o && o[p], obj);
};

const deleteObjectAtPath = (obj, path) => {
  const parts = path.split('.');
  const lastPart = parts.pop();
  const parent = getObjectAtPath(obj, parts.join('.'));
  if (parent && parent[lastPart]) {
    delete parent[lastPart];
  }
};

if (!body) {
  $done({});
  return;
}

let obj = JSON.parse(body);

if (url.includes('/v3/home')) {
  obj.data = recursivelyFilterByCellType(obj.data);
}

const deletePaths = [
  url.includes('/vip') ? 'data.big_banner' : null,
  url.includes('/publish/get_bubble') ? 'data' : null,
  url.includes('/vip/bottom_card_list') ? 'data.rows' : null,
  url.includes('/util/update') ? 'data.ad_black_list' : null,
  url.includes('/util/update') ? 'data.operation_float' : null,
  url.includes('/util/update') ? 'data.haojia_widget' : null,
  url.includes('/home/list') ? 'data.banner_v2' : null,
  url.includes('/publish') ? 'data.hongbao' : null,
].filter(Boolean);

deleteProperties(deletePaths);

if (url.includes('/v3/home') && obj.data && obj.data.functions) {
  obj.data.functions = obj.data.functions.filter((item) => item.type === 'message');
  fixPos(obj.data.functions);
}

const servicesFilter = ['articel_manage', '199794', '199796'];
if (obj.data && obj.data.services) {
  obj.data.services = obj.data.services.filter((item) => servicesFilter.includes(item.type));
  fixPos(obj.data.services);
}

if (url.includes('/v3/home') && obj.data && obj.data.component) {
  const componentFilter = ['circular_banner', 'fixed_banner', 'filter', 'list'];
  obj.data.component = obj.data.component.filter((item) => componentFilter.includes(item.zz_type));
  fixPos(obj.data.component);
}

if (obj.data && obj.data.rows?.length > 0) {
  obj.data.rows = obj.data.rows.filter(
    (item) => !item?.ad_banner_id && !['ad_campaign_id_', 'ad_campaign_name', 'abs_position'].includes(item?.ad)
  );
}

if (url.includes('/ajax_app/ajax_get_footer_list') && obj.data.activity_banner && obj.data.activity_banner.hot_widget) {
  obj.data.activity_banner.hot_widget = obj.data.activity_banner.hot_widget.filter((widget) => !widget.pic_url);
}

if (url.includes('/v1/app/home') && obj.data) {
  obj.data = obj.data.filter((item) => ['40', '20'].includes(item.id));
  fixPos(obj.data);
}

$done({ body: JSON.stringify(obj) });
