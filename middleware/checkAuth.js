var log = require('../utils/log')(module);
var HttpError = require('../routes/error').HttpError;

module.exports =  function (request, response, next) {
    if (!request.session.authorized ||
        (request.session.expires < new Date().getTime())) {
        next(new HttpError(401, 'Permission denied: user is not authorized'));
    }
    else {
        log.info('User is authorized: { mid: %d, expires: %d }',
            request.session.mid, request.session.expires);
        next();
    }
};
