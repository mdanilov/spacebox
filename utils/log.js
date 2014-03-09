var winston = require('winston'),
    config = require('../config');

require('winston-mail').Mail;

module.exports = makeLogger

function makeLogger(module) {
    var logger = new winston.Logger({transports : []});
    var path = module.filename.split(/[\\\/]/).slice(-1);

    if (path == "main.js") {
        logger.add(winston.transports.Mail, config.get('mail'));
    }

    if (config.get('NODE_ENV') === 'development') {
         logger.add(winston.transports.Console, {
            colorize: true,
            json: false,
            label: path
        });
    }

    logger.add(winston.transports.File, {
        filename: 'error.log',
        level: 'error',
        label: path,
        json: false
    });

    return logger;
};
