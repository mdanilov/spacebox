// Include New Relic analytics module
require('newrelic');

var log = require('./utils/log')(module);
var config = require('./config');
var manage = require('./manage');
var express = require('express');
var app = express();
var middleware = require('./middleware')(app, express);
var server = require('http').createServer(app);
var chat = require('./chat')(server);

server.listen(config.get('port'), function() {
    log.info('Server listening on port ' + config.get('port'));
});
