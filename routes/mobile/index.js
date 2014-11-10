var auth = require('./auth');
var routes = require('../../routes');
var validate = require('../../utils/validate');
var checkAuth = require('../../middleware/checkAuth');

var router = require('express').Router();

router.post('/login', validate, auth.login);
router.get('/getLoginStatus', validate, checkAuth, auth.getLoginStatus);
router.use(routes);

module.exports = router;
