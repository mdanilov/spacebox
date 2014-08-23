var os = require('os');
var https = require('https');
var config = require('../../config/index');
var log = require('../../utils/log')(module);

exports.login = function (request, response, next) {
    loginVk(request, response);
};

exports.logout = function (request, response, next) {
    request.session.destroy(function (error) {
        if (error) next(error);
        log.info('User session %s is deleted', request.session.mid);
        response.end();
    });
};

function loginVk (request, response) {
    var options = 'https://oauth.vk.com/access_token?' +
        'client_id=' + config.get('vk:apiID') +
        '&client_secret=' + config.get('vk:privateKey') +
        '&code=' + request.query.code +
        '&redirect_uri=' + config.get('vk:redirectUrl');
    https.get(options, function (res) {
        res.on("data", function (chunk) {
            var body = JSON.parse(chunk);
            if (body.error) {
                log.error('OAuthVK authorized error: %s', body.error);
                response.send(400);
            }
            else {
                request.session.authorized = true;
                request.session.mid = body.user_id;
                request.session.expires = os.uptime() + body.expires_in;
                request.session.access_token = body.access_token;
                log.info('VK user %s is authorized', request.session.mid);
                response.json({access_token: body.access_token});
            }
        });
    });
}
