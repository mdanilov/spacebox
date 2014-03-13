var auth = require('../routes/authentication'),
    os = require('os');

module.exports =  function(request, response, next) {
    if (!request.session.authorized ||
        (request.session.expires < os.uptime())) {
        response.redirect('/auth');
    }
    else {
        next();
    }
};
