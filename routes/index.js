var auth = require('./auth');
var database = require('./database');
var error = require('./error');
var main = require('./main');
var validate = require('../utils/validate');
var checkAuth = require('../middleware/checkAuth');

var router = require('express').Router();

router.get('/login', validate, auth.login);
router.get('/logout', validate, database.removeUser, auth.logout);

router.all('*', checkAuth);

router.get('/getUsers', validate, database.insertUserAndSelectNearUsers, database.selectLikes, main.getUsersWithLikes);
router.get('/changeLikeStatus', validate, database.changeLikeStatus);
router.get('/getFriends', validate, database.getFriends);
router.get('*', error['404']);

module.exports = router;
