var manage = require('./manage'),
    express = require('express'),
    app = express(),
    http = require('http'),
    middleware = require('./middleware')(app, express),
    log = require('./utils/log')(module),
    config = require('./config');

var port = process.env.PORT || config.get('port');

var server = http.createServer(app).listen(port, function() {
    log.info('Server listening on port ' + port);
});
