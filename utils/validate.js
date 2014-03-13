var validator = require('validator'),
    error = require('../routes/error'),
    config = require('../config');

exports.request = function (request, response, next) {
    if (validator.isFloat(request.query['latitude']) &&
        validator.isFloat(request.query['longitude']) &&
        (request.query['radius'] > 0) &&
        (request.query['radius'] < config.get("request:maxRadius"))) {
        next();
    }
    else {
        next(error['400']);
    }
}
