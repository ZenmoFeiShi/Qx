
const TAG = '[YT-ZH-Sub]';

(function() {
    var url = $request.url;

    if (/[?&]tlang=zh/.test(url) || /[?&]lang=zh/.test(url)) {
        console.log(TAG + ' already zh, skip');
        $done({});
        return;
    }

    var zhUrl = url + '&tlang=zh-Hans&_ytzhsub=1';

    var headers = {};
    if ($request.headers) {
        var keys = Object.keys($request.headers);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            if (k.toLowerCase() !== 'host') {
                headers[k] = $request.headers[k];
            }
        }
    }
    delete headers['Cookie'];
    delete headers['cookie'];

    console.log(TAG + ' fetching zh: ' + zhUrl.substring(0, 120));

    $task.fetch({
        url: zhUrl,
        method: 'GET',
        headers: headers
    }).then(function(resp) {
        var status = resp.statusCode || resp.status || 0;
        console.log(TAG + ' fetch status=' + status + ' bodyLen=' + (resp.body ? resp.body.length : 0));

        if (status === 200 && resp.body && resp.body.length > 100) {
            console.log(TAG + ' replaced with zh subtitle');
            $done({ body: resp.body });
        } else {
            console.log(TAG + ' fetch failed, keep original');
            $done({});
        }
    }, function(err) {
        console.log(TAG + ' fetch error: ' + (err.error || err));
        $done({});
    });
})();
