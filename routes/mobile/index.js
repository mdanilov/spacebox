var auth = require('./auth');
var routes = require('../../routes');
var validate = require('../../utils/validate');

var router = require('express').Router();

router.get('/login', validate, auth.login);
router.use(routes);

module.exports = router;
