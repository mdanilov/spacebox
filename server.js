var manage = require('./manage'),
    express = require('express'),
    app = express(),
    http = require('http'),
    middleware = require('./middleware')(app, express),
    log = require('./utils/log')(module),
    config = require('./config');

var server = http.createServer(app).listen(config.get('port'), function() {
    log.info('Server listening on port ' + config.get('port'));
});
