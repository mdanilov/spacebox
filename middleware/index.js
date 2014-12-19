module.exports = function (app, express) {
    var path = require('path');
    var bodyParser = require('body-parser');
    var cookieParser = require('cookie-parser');
    var session = require('express-session');
    var favicon = require('serve-favicon');
    var PGStore = require('connect-pgsql')(session);
    var winston = require('winston');
    var expressWinston = require('express-winston');
    var pg = require('pg');
    var log = require('../utils/log')(module);
    var router = require('../routes');
    var mobileRouter = require('../routes/mobile');
    var checkAuth = require('./checkAuth');
    var errorHandler = require('./errorHandler')(app);
    var config = require('../config');

    /* Favicon */
    app.use('/', favicon(path.join(__dirname, '../public/src/img/favicon.png')));

    /* Bundled middleware */
    app.use('/', bodyParser.json());
    app.use('/', bodyParser.urlencoded({ extended: true }));
    app.use('/', cookieParser());
    app.use('/', session({
        name: config.get('session:name'),
        store: new PGStore({
            getClient: function(next) {
                pg.connect(config.get('database:connection'), next);
            }
        }),
        secret: config.get('session:secret'),
        cookie: config.get('session:cookie'),
        resave: true,
        saveUninitialized: true
    }));

    /* Public directory */
    app.use('/', express.static(path.join(__dirname, '../public')));

    /* Logger */
    app.use(expressWinston.logger({
        transports: [
            new winston.transports.Console({
                json: config.get('logger:json'),
                colorize: config.get('logger:colorize')
            })
        ]
    }));

    /* Routing */
    app.use('/mobile', mobileRouter);
    app.use('/', router);

    /* Error handling */
    app.use('/', expressWinston.errorLogger({
        transports: [
            new winston.transports.Console({
                json: config.get('logger:json'),
                colorize: config.get('logger:colorize')
            })
        ]
    }));
    app.use('/', errorHandler);
};
