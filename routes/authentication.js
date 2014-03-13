var config = require('../config'),
    os = require('os'),
    https = require('https'),
    PGStore = require('connect-pgsql'),
    crypto = require('crypto');

module.exports = function (request, response) {
    if (request.query.login === "") {
        loginVkOpenApi(request, response);
    }
    else if (request.query.logout === "") {
        request.session.destroy(function (error) {
            response.json('/auth');
        });
    }
    else {
        response.render('auth', {
            vkApiID: config.get('vk:apiID'),
        });
    }
}

function loginVkOAuth2(request, response) {
    if (request.query.code) {
        var options = 'https://oauth.vk.com/access_token?' +
        'client_id=' + config.get('vk:apiId') +
        '&client_secret=' + config.get('vk:privateKey') + 
        '&code=' + request.query.code +
        '&redirect_uri=' + config.get('vk:redirectUrl');
        https.get(options, function (res) {
            res.on("data", function (chunk) {
                var body = JSON.parse(chunk);
                if (body.error) {
                    response.send(401);
                }
                else {
                    request.session.authorized = true;
                    request.session.mid = body.user_id;
                    request.session.expires = os.uptime() + body.expires_in;
                    request.session.access_token = body.access_token;
                    response.redirect('/');
                }
            });
        });
    }
}

function loginVkOpenApi(request, response) {
    var session = request.query.session;
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
            response.json('/');
        }
        else {
            response.send(401);
        }
    }
}
