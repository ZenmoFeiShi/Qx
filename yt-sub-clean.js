

var headers = Object.assign({}, $request.headers);
delete headers['Cookie'];
delete headers['cookie'];
$done({ headers: headers });
