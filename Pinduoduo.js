// 2024.08.10
const url = $request.url;
let obj = JSON.parse($response.body);

if (url.includes('/api/alexa/homepage/hub')) {
    if (obj.result) {
        delete obj.result.search_bar_hot_query;
        delete obj.result.icon_set;
       // delete obj.result.buffer_bottom_tabs;        
       // delete obj.result.module_order;
     //   delete obj.result.dy_module; // 百亿补贴 买菜
      //  delete obj.result.all_top_opts; // 首页顶部tap
        //delete obj.result.selected_bottom_skin;
     //   delete obj.result.icon_set_skin;

        // Remove tabs with specific titles
        obj.result.bottom_tabs = obj.result.bottom_tabs.filter(tab => {
            return tab.title !== '多多视频' && tab.title !== '大促会场' && tab.title !== '搜索' && tab.title !== '直播';
        });
    }
}

if (url.includes('/api/philo/personal/hub')) {
    delete obj.monthly_card_entrance;
    delete obj.personal_center_style_v2_vo;
    if (obj.icon_set) {
        delete obj.icon_set.icons;
        delete obj.icon_set.top_personal_icons;
    }
}

if (url.includes("/api/oak/integration/render")) {
    delete obj.ui.bottom_section;  //限时
    delete obj.ui.live_section.float_info;  //直播
    delete obj.bottom_section_list; //限时
    }
    
$done({body: JSON.stringify(obj)});
