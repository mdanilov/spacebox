module.exports = function (app, express) {
    var ejs = require('ejs-locals'),
        path = require('path'),
        log = require('../utils/log')(module),
        router = require('../routes'),
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

    /* Routing */
    app.use(app.router);
    router(app);

    /* Public directory */
    app.use(express.static(path.join(__dirname, '../public')));
    app.use("/public", express.static(path.join(__dirname, '../public')));
}
