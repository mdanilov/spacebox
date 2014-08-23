﻿var os = require('os');
var crypto = require('crypto');
var config = require('../config/index');
var log = require('../utils/log')(module);

exports.login = function (request, response, next) {
    loginVk(request, response);
};

exports.logout = function (request, response, next) {
    var mid = request.session.mid;
    request.session.destroy(function (error) {
        if (error) next(error);
        log.info('User session %s is deleted', mid);
        response.end();
    });
};

function loginVk (request, response) {
    var session = request.query;
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
            log.info('VK user %s is authorized', request.session.mid);
            response.end();
        }
        else {
            log.error('OpenApiVK authorized error: wrong signature');
            response.send(400);
        }
    }
}
