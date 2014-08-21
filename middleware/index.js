module.exports = function (app, express) {
    var path = require('path');
    var ejs = require('ejs-locals');
    var bodyParser = require('body-parser');
    var cookieParser = require('cookie-parser');
    var session = require('express-session');
    var PGStore = require('connect-pgsql')(session);
    var pg = require('pg');
    var log = require('../utils/log')(module);
    var router = require('../routes');
    var mobileRouter = require('../routes/mobile');
    var checkAuth = require('./checkAuth');
    var errorHandler = require('./errorHandler')(app);
    var config = require('../config');

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

    /* TODO: logger */
    app.use('/', function (request, response, next) {
        console.log('%s %s', request.method, response.url);
        next();
    });

    /* Routing */
    app.use('/mobile', mobileRouter);
    app.use('/', router);

    /* Error handling */
    app.use('/', errorHandler);
};
