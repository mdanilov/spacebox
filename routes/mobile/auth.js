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
                var message = 'OAuth2 authorized error: ' + body.error;
                next(new HttpError(400, message));
            }
            else {
                request.session.authorized = true;
                request.session.mid = body.user_id;
                request.session.expires = os.uptime() + body.expires_in;
                request.session.access_token = body.access_token;
                log.info('VK user %s has been authorized using OAuth2', request.session.mid);
                response.redirect('back');
            }
        });
    });
};

exports.getLoginStatus = function (request, response, next) {
    response.json(request.session);
};

exports.logout = function (request, response, next) {
    request.session.destroy(function (error) {
        if (error) {
            next(new HttpError(400, error));
        }
        log.info('User session %s is deleted', request.session.mid);
        response.end();
    });
};
