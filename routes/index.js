var auth = require('./auth');
var database = require('./database');
var error = require('./error');
var validate = require('../utils/validate');
var checkAuth = require('../middleware/checkAuth');

var router = require('express').Router();

router.get('/login', auth.login);
router.get('/logout', database.removeUser, auth.logout);
router.all('*', checkAuth);
router.get('/getUsers', validate.request, database.addUser);
router.get('/getLikes', database.getLikes);
router.get('/like', database.addLike);
router.get('/dislike', database.removeLike);
router.get('*', error['404']);

module.exports = router;
