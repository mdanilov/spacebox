var jjv = require('jjv');
var config = require('../config');
var log = require('./log')(module);
var schema = require('../schema/request.json');

(function() {
    var env = jjv();
    env.addSchema('schema', schema);

    module.exports = function (request, response, next) {
        var errors = env.validate('schema', { "request": request.query });
        if (!errors) {
            log.info('Request has been validated');
            next();
        } else {
            next(400);
        }
    };
})();
