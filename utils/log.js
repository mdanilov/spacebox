var winston = require('winston');
var config = require('../config');

module.exports = makeLogger;

function makeLogger (module) {
    var logger = new winston.Logger({transports : []});
    var path = module.filename.split(/[\\\/]/);
    path = path.slice(-2).join('][');

    var options = {
        label: path,
        json: true,
        level:'error',
        colorize: false
    };

    if (config.get('NODE_ENV') === 'development') {
        options.level = 'info';
        options.colorize = true;
        options.json = false;
    }

    logger.add(winston.transports.Console, options);

    return logger;
}
