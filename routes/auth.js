var os = require('os');
var crypto = require('crypto');
var config = require('../config/index');
var log = require('../utils/log')(module);
var HttpError = require('../routes/error').HttpError;

exports.login = function (request, response, next) {
    var session = request.body;
    var md5sum = crypto.createHash('md5');

    md5sum.update('expire=' + session['expire']);
    md5sum.update('mid=' + session['mid']);
    md5sum.update('secret=' + session['secret']);
    md5sum.update('sid=' + session['sid']);
    md5sum.update(config.get('vk:privateKey'));

    if (session.sig === md5sum.digest('hex')) {
        var sess = request.session;
        sess.authorized = true;
        sess.expires = session.expire + os.uptime();
        sess.mid = session.mid;
        log.info('VK OpenAPI session has created ', sess.mid);
        response.end();
    }
    else {
        next(new HttpError(400, 'OpenAPI authorized error: wrong signature'));
    }
};

exports.logout = function (request, response, next) {
    request.session.destroy(function (error) {
        if (error) {
            next(new HttpError(500, error));
        }
        log.info('VK OpenAPI session has deleted');
        response.end();
    });
};
