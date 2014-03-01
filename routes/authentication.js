var config = require('../config'),
    os = require('os'),
    crypto = require('crypto');

exports.login = function(request, response) {
    if (!request.session.checked) {
        request.session.checked = true;
        response.render('login', { vk_api_id: config.get('vk:apiId'), check: true });
    }
    else {
        if (checkSign(request.query)) {
            request.session.authorized = true;
            request.session.mid = request.query['mid'];
            response.json('/');
        }
        else {
            response.render('login', { vk_api_id: config.get('vk:apiId'), check: false });
        }
    }
}

exports.logout = function(request, response) {
    request.session.authorized = false;
    request.session.checked = true;
    response.render('login', { vk_api_id: config.get('vk:apiId'), check: true });
}

checkSign = function(query) {
    if (query.sig)
    {
        var md5sum = crypto.createHash('md5');

        md5sum.update('expire=' + query['expire']);
        md5sum.update('mid=' + query['mid']);
        md5sum.update('secret=' + query['secret']);
        md5sum.update('sid=' + query['sid']);
        md5sum.update(config.get('vk:privateKey'));

        if (query['sig'] === md5sum.digest('hex') &&
            query['expire'] > os.uptime()) {
            return true;
        }
    }

    return false;
}
