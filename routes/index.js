var auth = require('./auth');
var database = require('./database');
var error = require('./error');
var main = require('./main');
var jsv = require('../utils/validate');
var checkAuth = require('../middleware/checkAuth');

var router = require('express').Router();

router.get('/login', jsv.validate, auth.login);
router.get('/logout', jsv.validate, database.removeUser, auth.logout);

router.all('*', checkAuth);

router.get('/getUsers', jsv.validate, database.insertUserAndSelectNearUsers, database.selectLikes, main.getUsersWithLikes);
router.get('/like', jsv.validate, database.insertLike);
router.get('/dislike', jsv.validate, database.deleteLike);
router.get('*', error['404']);

module.exports = router;
