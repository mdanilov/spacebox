(function () {

    var util = require('util');
    var error = {};

    error.HttpError = function (error, opt_message) {
        this.status = error;
        this.message = opt_message ? opt_message : "";
        Error.captureStackTrace(this, error.HttpError);
    }
    util.inherits(error.HttpError, Error);
    error.HttpError.prototype.name = 'HttpError';

    error['400'] = function (request, response, next) {
        next(new error.HttpError(404, 'Bad Request'));
    }

    error['404'] = function (request, response, next) {
        next(new error.HttpError(404, 'Page Not Found'));
    }

    module.exports = error;

})();
