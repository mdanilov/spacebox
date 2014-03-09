var main = require('./main'),
    auth = require('./authentication'),
    validate = require('../utils/validate.js'),
    error = require('./error'),
    database = require('./database');

module.exports = function (app) {
    app.get('/', main.home);

    app.get('/user', validate.request, database.addUser);
    app.get('/logout', auth.logout);

    app.post('/feedback', main.feedback);

    app.get('*', error['404']);
}
