var auth = require('../routes/authentication'),
    os = require('os');

module.exports =  function(request, response, next) {
    if (!request.session.authorized) {
        auth.login(request, response);
    }
    else {
        next();
    }
};
