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
    
    if (path.match(/server.js$/)) {
        logger.add(winston.transports.File, {
            filename: 'server.log',
            json: false,
            level: winston.levels.error
        });
    }
    else if (path.match(/manage.js$/)) {
        logger.add(winston.transports.File, {
            filename: 'manage.log',
            json: false,
            level: winston.levels.error
        });       
    }

    return logger;
}
