var main = require('./main'),
    auth = require('./authentication'),
    validate = require('../utils/validate.js'),
    error = require('./error'),
    checkAuth = require('../middleware/checkAuth'),
    database = require('./database');

module.exports = function (app) {
    app.post('/feedback', main.feedback);
    app.get('/auth', auth);

    app.all('*', checkAuth);

    app.get('/', main.home);
    app.get('/user', validate.request, database.addUser);

    app.get('*', error['404']);
};
