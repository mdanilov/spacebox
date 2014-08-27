var jjv = require('jjv');
var config = require('../config');
var log = require('./log')(module);
var schema = require('../schema/request-schema.json');

var JSV = (function() {
    var _env = jjv();
    _env.addSchema('request-schema', schema);

    return {
        validate: function (request, response, next) {
            var errors = _env.validate('request-schema', { "request": request.query });
            if (!errors) {
                log.info('Request has been validated');
                next();
            } else {
                next(errors);
            }
        }
    };
})();

module.exports = JSV;
