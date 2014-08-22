var os = require('os');
var https = require('https');
var config = require('../../config/index');
var log = require('../../utils/log')(module);

module.exports = function (request, response) {
    switch (request.query.action)
    {
        case 'login':
            loginVk(request, response);
            break;
        case 'logout':
            log.info('User %s deleted', request.session.mid);
            request.session.destroy(function (error) {
                response.end();
            });
            break;
        default:
            log.error('Wrong authorized request');
            response.send(400);
            break;
    }
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
