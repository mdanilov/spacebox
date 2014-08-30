var os = require('os');
var crypto = require('crypto');
var config = require('../config/index');
var log = require('../utils/log')(module);
var HttpError = require('../routes/error').HttpError;

exports.login = function (request, response, next) {
    var session = request.query;
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
        log.info('VK user id%s has been authorized using OpenAPI', request.session.mid);
        response.end();
    }
    else {
        next(new HttpError(400, 'OpenAPI authorized error: wrong signature'));
    }
};

exports.logout = function (request, response, next) {
    var mid = request.session.mid;
    request.session.destroy(function (error) {
        if (error) {
            next(new HttpError(400, error));
        }
        log.info('User id%s session has been deleted', mid);
        response.end();
    });
};
