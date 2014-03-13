var log = require('../utils/log')(module),
    config = require('../config');

/**
 * Method: GET
 * URI: /
 * */
exports.home = function(request, response) {
    response.render('index', {
        vkApiID: config.get('vk:apiID')
    });
};

/**
 * Method: POST
 * URI: /feedback
 * */
exports.feedback = function (request, response) {
    log.info(request.body);
    response.end();
};
