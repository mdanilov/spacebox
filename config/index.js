var path = require('path');
var nconf = require('nconf');

nconf.argv().env().file({file: path.join(__dirname, 'config.json')});

if (process.env.NODE_ENV === 'development') {
    nconf.set('database:options:clearInterval', undefined);
}

if (process.env.PORT) {
    nconf.set('port', process.env.PORT);
}

// Connecting to a Heroku Postgres database from outside of the Heroku network requires SSL.
// Example: $(DATABASE_URL)?ssl=true
nconf.set('database:connection', process.env.DATABASE_URL);
nconf.set('vk:privateKey', process.env.VK_PRIVATE_KEY);

module.exports = nconf;
