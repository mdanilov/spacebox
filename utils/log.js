var winston = require('winston');
var mail = require('winston-mail').Mail;
var config = require('../config');

module.exports = makeLogger;

function makeLogger (module) {
    var logger = new winston.Logger({transports : []});
    var path = module.filename.split(/[\\\/]/);
    path = path.slice(-2).join('][');

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
    else {
        logger.add(winston.transports.File, {
            filename: 'log',
            level: 'error',
            label: path,
            json: false
        });
    }

    return logger;
}
