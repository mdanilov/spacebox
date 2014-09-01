// Include New Relic analytics module
require('./newrelic');

var http = require('http');
var log = require('./utils/log')(module);
var config = require('./config');
var manage = require('./manage');
var express = require('express');
var app = express();
var middleware = require('./middleware')(app, express);

http.createServer(app).listen(config.get('port'), function() {
    log.info('Server listening on port ' + config.get('port'));
});
