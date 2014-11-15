var os = require('os');
var https = require('https');
var url = require('url');
var config = require('../../config/index');
var log = require('../../utils/log')(module);
var HttpError = require('../../routes/error').HttpError;

exports.login = function (request, response, next) {
    var options = 'https://oauth.vk.com/access_token?' +
        'client_id=' + config.get('vk:apiID') +
        '&client_secret=' + config.get('vk:privateKey') +
        '&code=' + request.query.code +
        '&redirect_uri=' + url.resolve(request.headers.referer, request.query.url);

    https.get(options, function (res) {
        res.on("data", function (chunk) {
            var body = JSON.parse(chunk);
            if (body.error) {
                var error = {
                    error: 'vk oauth2 error',
                    url: option,
                    message: body
                };
                next(new HttpError(400, JSON.stringify(error)));
            }
            else {
                var session = request.session;
                session.authorized = true;
                session.expires = os.uptime() + body.expires_in;
                session.mid = body.user_id;
                session.access_token = body.access_token;
                session.save();
                log.info('VK OAuth2 session has created ', session.mid, session.access_token);
                response.redirect('back');
            }
        });
    });
};

exports.getLoginStatus = function (request, response, next) {
    var session = request.session;
    log.info('Get VK OAuth2 session ', session.mid, session.access_token);
    response.json({
        mid: session.mid,
        access_token: session.access_token,
        expires: session.expires
    });
};

exports.logout = function (request, response, next) {
    request.session.destroy(function (error) {
        if (error) {
            next(new HttpError(500, error));
        }
        log.info('VK OAuth2 session has deleted');
        response.end();
    });
};
