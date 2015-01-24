var https = require('https');
var url = require('url');
var config = require('../../config/index');
var log = require('../../utils/log')(module);
var HttpError = require('../../routes/error').HttpError;

exports.login = function (request, response, next) {
    var hostname = request.protocol + '://' + request.headers.host + '/';
    var redirectURl = request.query.standalone ?
        config.get('vk:redirectBlankUrl') : url.resolve(hostname, request.query.url);
    var options = 'https://oauth.vk.com/access_token?' +
        'client_id=' + config.get('vk:mobile:appId') +
        '&client_secret=' + config.get('vk:mobile:privateKey') +
        '&code=' + request.query.code +
        '&redirect_uri=' + redirectURl;

    https.get(options, function (res) {
        res.on("data", function (chunk) {
            var body = JSON.parse(chunk);
            if (body.error) {
                var error = {
                    error: 'vk oauth2 error',
                    url: options,
                    message: body
                };
                next(new HttpError(400, JSON.stringify(error)));
            }
            else {
                request.session.authorized = true;
                request.session.expires = new Date().getTime() + body.expires_in * 1000;
                request.session.mid = body.user_id;
                request.session.access_token = body.access_token;
                log.info('VK OAuth2 session instance initialized at ', request.session);
                if (request.query.standalone) {
                    response.end();
                }
                else {
                    response.redirect('back');
                }
            }
        });
    });
};

exports.getLoginStatus = function (request, response, next) {
    log.info('Get VK OAuth2 session ',
        request.session.mid, request.session.access_token);
    response.json({
        mid: request.session.mid,
        access_token: request.session.access_token,
        expires: request.session.expires
    });
};

exports.logout = function (request, response, next) {
    request.session.destroy(function (error) {
        if (error) {
            next(new HttpError(500, error));
        }
        else {
            log.info('VK OAuth2 session has deleted');
            response.end();
        }
    });
};
