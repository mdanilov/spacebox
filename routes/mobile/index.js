var auth = require('./auth');
var routes = require('../../routes');

var router = require('express').Router();

router.get('/auth', auth);
router.use(routes);

module.exports = router;
