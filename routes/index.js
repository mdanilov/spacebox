var main = require('./main'),
    auth = require('./authentication'),
    validate = require('../utils/validate.js'),
    database = require('./database');

module.exports = function (app) {
    app.get('/', main.home);
    app.get('/user', validate.request, database.addUser);
    app.get('/logout', auth.logout);
}
