//2024.8.22

const isRequest = typeof $request !== 'undefined';
const isSurge = typeof $httpClient !== 'undefined'; 
const isLoon = typeof $loon !== 'undefined'; 
const isQX = typeof $task !== 'undefined'; 

const notify = (title, subtitle, message) => {
    if (isQX) $notify(title, subtitle, message);
    if (isSurge) $notification.post(title, subtitle, message);
    if (isLoon) $notification.post(title, subtitle, message);
};

const setValueForKey = (value, key) => {
    if (isQX) return $prefs.setValueForKey(value, key);
    if (isSurge || isLoon) return $persistentStore.write(value, key);
};

const valueForKey = (key) => {
    if (isQX) return $prefs.valueForKey(key);
    if (isSurge || isLoon) return $persistentStore.read(key);
};

const fetch = (options) => {
    if (isQX) return $task.fetch(options);
    if (isSurge) {
        return new Promise((resolve, reject) => {
            $httpClient.post(options, (error, response, data) => {
                if (error) reject(error);
                else resolve({ statusCode: response.status, headers: response.headers, body: data });
            });
        });
    }
    if (isLoon) {
        return new Promise((resolve, reject) => {
            $httpClient.post(options, (error, response, data) => {
                if (error) reject(error);
                else resolve({ statusCode: response.status, headers: response.headers, body: data });
            });
        });
    }
};

if (isRequest) {
    const url = $request.url;
    const headers = JSON.stringify($request.headers);
    const body = $request.body;

    setValueForKey(url, 'Emby_request_url');
    setValueForKey(headers, 'Emby_request_headers');
    if (body) {
        setValueForKey(body, 'Emby_request_body');
    }

    notify("大叔Emby请求捕获", "成功✅", "");
    $done({});
} else {
    function replayRequest() {
        try {
            let savedUrl = valueForKey('Emby_request_url');
            let savedHeaders = valueForKey('Emby_request_headers');
            let savedBody = valueForKey('Emby_request_body');

            if (!savedUrl || !savedHeaders) {
                throw new Error('未找到保存的URL或请求头');
            }

            let parsedHeaders = JSON.parse(savedHeaders);

            notify("大叔Emby", "准备播放", 
                `Headers: ✅\n` +
                `Body: ${savedBody ? '✅' : '无内容❌'}`
            );

            fetch({
                url: savedUrl,
                method: 'POST',
                headers: parsedHeaders,
                body: savedBody
            }).then(response => {
                if (response.statusCode === 204) {
                    notify("大叔Emby", "播放成功🎉", "状态码204");
                } else {
                    notify("大叔Emby", "失败", `状态码: ${response.statusCode}`);
                }
                $done();
            }, reason => {
                notify("大叔Emby", "错误", `错误信息: ${reason.error}`);
                $done();
            });
        } catch (e) {
            notify("大叔Emby", "错误", `错误信息: ${e.message || e}`);
            $done();
        }
    }

    replayRequest();
}
