var path = require('path');
var nconf = require('nconf');

nconf.argv().env().file({file: path.join(__dirname, 'config.json')});

if (process.env.NODE_ENV === 'development') {
    nconf.set('database:connection:ssl', true);
    nconf.set('database:options:clearInterval', undefined);
}

if (process.env.PORT) {
    nconf.set('port', process.env.PORT);
}

if (process.env.DATABASE_URL) {
    nconf.set('database:connection', process.env.DATABASE_URL);
}

module.exports = nconf;
