var auth = require('./auth');
var routes = require('../../routes');
var jsv = require('../../utils/validate');

var router = require('express').Router();

router.get('/login', jsv.validate, auth.login);
router.use(routes);

module.exports = router;
