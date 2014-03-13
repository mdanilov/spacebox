var nconf = require('nconf'),
    path = require('path');

nconf.argv().env().file({file: path.join(__dirname, 'config.json')});

if (process.env.NODE_ENV === 'development') {
    nconf.set('database:connection:ssl', true);
    nconf.set('database:options:clearInterval', undefined);
}

if (process.env.PORT) {
    nconf.set('port', process.env.PORT);
}

module.exports = nconf;
