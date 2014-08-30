(function () {
    var util = require('util');
    var log = require('../utils/log')(module);
    var error = {};

    error.HttpError = function (error, opt_message) {
        this.status = error;
        this.message = opt_message ? opt_message : "";
    };
    util.inherits(error.HttpError, Error);
    error.HttpError.prototype.name = 'HttpError';

    error['404'] = function (request, response, next) {
        log.info('Page Not Found');
        response.send(404);
    };

    module.exports = error;
})();
