var os = require('os');

module.exports =  function (request, response, next) {
    if (!request.session.authorized ||
        (request.session.expires < os.uptime())) {
        response.send(400);
    }
    else {
        next();
    }
};
