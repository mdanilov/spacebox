var jjv = require('jjv');
var config = require('../config');
var log = require('./log')(module);
var schema = require('../schema/request.json');
var HttpError = require('../routes/error').HttpError;

(function() {
    var env = jjv();
    env.addSchema('schema', schema);

    module.exports = function (request, response, next) {
        var query = (request.method == 'POST') ? request.body : request.query;
        query.url = request.originalUrl.split('?')[0];

        var errors = env.validate('schema', { "request": query });
        if (!errors) {
            log.info('Request has been validated');
            next();
        } else {
            next(new HttpError(400, 'Request is not valid: ' + JSON.stringify(errors)));
        }
    };
})();
