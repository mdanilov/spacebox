var auth = require('./auth');
var database = require('./database');
var error = require('./error');
var main = require('./main');
var validate = require('../utils/validate');
var checkAuth = require('../middleware/checkAuth');

var router = require('express').Router();

router.get('/login', auth.login);
router.get('/logout', database.removeUser, auth.logout);

router.all('*', checkAuth);

router.get('/getUsers', validate.request, database.addUserAndGetNearUsers, database.getLikes, main.getUsersWithLikes);
router.get('/like', database.insertLike);
router.get('/dislike', database.deleteLike);
router.get('*', error['404']);

module.exports = router;
