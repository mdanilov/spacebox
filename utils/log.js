var winston = require('winston');

module.exports = makeLogger

function makeLogger(module) {
    var logger = new winston.Logger({transports : []});
    var path = module.filename.split('/').slice(-2).join('/');

    if (process.env.NODE_ENV == 'development') {
         logger.add(winston.transports.Console, {
            colorize: true,
            json: false,
            label: path
        });
    }

    logger.add(winston.transports.File, {
        filename: 'debug.log',
        json: false
    });

    return logger;
}
