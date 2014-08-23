var auth = require('./auth');
var routes = require('../../routes');

var router = require('express').Router();

router.get('/login', auth.login);
router.use(routes);

module.exports = router;
