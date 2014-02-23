var log = require('../utils/log')(module),
    config = require('../config');

/**
 * Method: GET
 * URI: /
 * */
exports.home = function(request, response) {
    var get = request.params;
    response.render('index', { vk_api_id: config.get('vk_api_id') });
};
