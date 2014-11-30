var auth = require('./auth');
var database = require('./database');
var account = require('./account');
var friends = require('./friends');
var status = require('./status');
var error = require('./error');
var main = require('./main');
var validate = require('../utils/validate');
var checkAuth = require('../middleware/checkAuth');

var router = require('express').Router();

router.post('/login', validate, auth.login);
router.get('/logout', validate, database.removeUser, auth.logout);

router.all('*', checkAuth);

router.post('/users.get', validate, database.selectUsers, database.selectLikes, main.getUsersWithLikes);
router.get('/changeLikeStatus', validate, database.changeLikeStatus);

router.get('/friends.get', validate, friends.get);
router.get('/friends.delete', validate, friends.delete);

router.get('/status.set', validate, status.set);
router.get('/status.get', validate, status.get);

router.get('/account.destroy', validate, account.destroy);

router.get('*', error['404']);

module.exports = router;
