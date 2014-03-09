module.exports = function (app, express) {
    var ejs = require('ejs-locals'),
        path = require('path'),
        PGStore = require('connect-pgsql')(express),
        pg = require('pg'),
        log = require('../utils/log')(module),
        router = require('../routes'),
        checkAuth = require('./checkAuth'),
        errorHandler = require('./errorHandler')(app, express),
        config = require('../config');

    /* Page Rendering */
    app.engine('html', ejs);
    app.engine('ejs', ejs);
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');

    /* Favicon */
    app.use(express.favicon());

    /* Logger */
    if (app.get('env') == 'development') {
        app.use(express.logger('dev'));
    }

    /* Session */
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: config.get('session:secret'),
        store: new PGStore({
            getClient: function(next) {
                pg.connect(process.env.DATABASE_URL || config.get('database:connection'), next);
            }
        }),
        cookie: config.get('session:cookie')
    }));

    /* Authorization Access */
    app.use(checkAuth);

    /* Public directory */
    app.use(express.static(path.join(__dirname, '../public')));
    app.use("/public", express.static(path.join(__dirname, '../public')));

    /* Routing */
    app.use(app.router);
    router(app);

    /* Error handling */
    app.use(errorHandler);
}
