var winston = require('winston');
var config = require('../config');

module.exports = makeLogger;

function makeLogger (module) {
    var logger = new winston.Logger({transports : []});
    var path = module.filename.split(/[\\\/]/);
    path = path.slice(-2).join('][');

    var options = {
        label: path,
        json: config.get('logger:json'),
        colorize: config.get('logger:colorize'),
        level: 'error'
    };

    if (config.get('NODE_ENV') === 'development') {
        options.level = 'info';
    }

    logger.add(winston.transports.Console, options);

    return logger;
}
