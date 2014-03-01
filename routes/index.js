var main = require('./main'),
    auth = require('./authentication'),
    database = require('./database');

module.exports = function (app) {
    app.get('/', main.home);
    app.get('/user', database.addUser);
    app.get('/logout', auth.logout);
}
