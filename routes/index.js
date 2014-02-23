var main = require('./main'),
    database = require('./database');

module.exports = function (app) {
    app.get('/', main.home);
    app.get('/user', database.addUser)
};
