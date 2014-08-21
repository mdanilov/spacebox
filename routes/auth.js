var os = require('os');
var crypto = require('crypto');
var config = require('../config/index');

module.exports = function (request, response) {
    if (request.query.action === 'login') {
        loginVk(request, response);
    }
    else if (request.query.action === 'logout') {
        request.session.destroy(function (error) {
            response.end();
        });
    }
    else {
        response.send(400);
    }
};

function loginVk (request, response) {
    var session = request.query.code;
    if (session.sig) {
        var md5sum = crypto.createHash('md5');

        md5sum.update('expire=' + session['expire']);
        md5sum.update('mid=' + session['mid']);
        md5sum.update('secret=' + session['secret']);
        md5sum.update('sid=' + session['sid']);
        md5sum.update(config.get('vk:privateKey'));

        if (session.sig === md5sum.digest('hex')) {
            request.session.authorized = true;
            request.session.mid = session.mid;
            request.session.expires = session.expire + os.uptime();
            response.end();
        }
        else {
            response.send(400);
        }
    }
}
