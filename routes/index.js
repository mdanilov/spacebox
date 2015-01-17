var auth = require('./auth');
var users = require('./users');
var account = require('./account');
var friends = require('./friends');
var status = require('./status');
var error = require('./error');
var messages = require('./messages');
var likes = require('./likes');
var validate = require('../utils/validate');
var checkAuth = require('../middleware/checkAuth');

var router = require('express').Router();

router.post('/login', validate, auth.login);
router.get('/logout', validate, auth.logout);

router.all('*', checkAuth);

router.post('/users.get', validate, users.get, likes.get);
router.get('/changeLikeStatus', validate, users.changeLikeStatus);

router.get('/friends.get', validate, friends.get);
router.get('/friends.delete', validate, friends.delete);

router.post('/status.set', validate, status.set);
router.post('/status.get', validate, status.get);

router.post('/messages.get', validate, messages.get);
router.post('/messages.getDialogs', validate, messages.getDialogs);
router.post('/messages.getHistory', validate, messages.getHistory);
router.post('/messages.markAsRead', validate, messages.markAsRead);

router.get('/account.destroy', validate, account.destroy);

router.get('*', error['404']);

module.exports = router;
