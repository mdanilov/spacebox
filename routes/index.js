var auth = require('./auth');
var database = require('./database');
var error = require('./error');
var validate = require('../utils/validate');
var checkAuth = require('../middleware/checkAuth');

var router = require('express').Router();

router.get('/auth', auth);
router.all('*', checkAuth);
router.get('/user', validate.request, database.addUser);
router.get('*', error['404']);

module.exports = router;
