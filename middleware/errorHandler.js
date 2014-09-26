var config = require('../config');

module.exports = function (app) {
    var log = require('../utils/log')(module),
        HttpError = require('../routes/error').HttpError;

    return function (error, request, response, next) {
        if (typeof error === 'number') {
            error = new HttpError(error);
        }

        if (error instanceof HttpError) {
            log.error(error.message);
            response.status(error.status).end();
        } else {
            log.error('Internal server error');
            response.status(500).end();
        }
    };
};
