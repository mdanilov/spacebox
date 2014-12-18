var path = require('path');
var nconf = require('nconf');

nconf.argv().env().file({file: path.join(__dirname, 'config.json')});

if (process.env.NODE_ENV === 'development') {
    nconf.set('database:dateRange', undefined);
}

if (process.env.PORT) {
    nconf.set('port', process.env.PORT);
}

// Connecting to a Heroku Postgres database from outside of the Heroku network requires SSL.
// Example: $(DATABASE_URL)?ssl=true
nconf.set('database:connection', process.env.DATABASE_URL);

nconf.set('vk:website:privateKey', process.env.VK_WEBSITE_PRIVATE_KEY);
nconf.set('vk:mobile:privateKey', process.env.VK_MOBILE_PRIVATE_KEY);

// TODO: Please note that secure: true is a recommended option. However, it requires an https-enabled website,
// i.e., HTTPS is necessary for secure cookies. If secure is set, and you access your site over HTTP,
// the cookie will not be set.
nconf.set('session:secret', process.env.SESSION_SECRET);

module.exports = nconf;
