﻿module.exports = function (app, express) {
    var path = require('path');
    var bodyParser = require('body-parser');
    var cookieParser = require('cookie-parser');
    var session = require('express-session');
    var favicon = require('serve-favicon');
    var PGStore = require('connect-pgsql')(session);
    var pg = require('pg');
    var log = require('../utils/log')(module);
    var router = require('../routes');
    var mobileRouter = require('../routes/mobile');
    var checkAuth = require('./checkAuth');
    var errorHandler = require('./errorHandler')(app);
    var config = require('../config');

    /* Favicon */
    app.use('/', favicon(path.join(__dirname, '../public/favicon.ico')));

    /* Bundled middleware */
    app.use('/', bodyParser.json());
    app.use('/', bodyParser.urlencoded({ extended: true }));
    app.use('/', cookieParser());
    app.use('/', session({
        secret: config.get('session:secret'),
        store: new PGStore({
            getClient: function(next) {
                pg.connect(config.get('database:connection'), next);
            }
        }),
        cookie: config.get('session:cookie'),
        resave: true,
        saveUninitialized: true
    }));

    /* Public directory */
    app.use('/', express.static(path.join(__dirname, '../public')));

    /* Logger */
    app.use('/', function (request, response, next) {
        log.info('%s %s', request.method, request.url);
        next();
    });

    /* Routing */
    app.use('/mobile', mobileRouter);
    app.use('/', router);

    /* Error handling */
    app.use('/', errorHandler);
};
