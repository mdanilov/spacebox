var os = require('os');
var log = require('../utils/log')(module);

module.exports =  function (request, response, next) {
    if (!request.session.authorized ||
        (request.session.expires < os.uptime())) {
        log.info('Permission denied: user is not authorized');
        response.send(400);
    }
    else {
        next();
    }
};
