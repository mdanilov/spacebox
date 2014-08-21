var config = require('../config');

var sendHttpError = function (error, response) {
    response.status(error.status);

    if (response.req.xhr) {
        response.json(error);
    } else {
        response.render('error', {
            error: {
                status: error.status,
                message: error.message,
                stack: (process.env.NODE_ENV === 'development') ? error.stack : null
            },
            project: config.get('project')
        });
    }
};

module.exports = function (app) {
    var log = require('../utils/log')(module),
        HttpError = require('../routes/error').HttpError;

    return function (error, request, response, next) {
        if (typeof error === 'number') {
            error = new HttpError(error);
        }
        if (error instanceof HttpError) {
            sendHttpError(error, response);
        } else {
            if (config.get('NODE_ENV') === 'development') {
                //express.errorHandler()(error, request, response, next);
            } else {
                log.error(error);
                error = new HttpError(500);
                sendHttpError(error, response);
            }
        }
    };
};
