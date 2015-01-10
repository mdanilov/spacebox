var log = require('../utils/log')(module);
var async = require('async');
var config = require('../config/index');
var db = require('pg-bricks').configure(config.get('database:connection'));

exports.get = function (request, response, next) {
    try {
        var userId = request.session.mid;
        var uids = response.users.map(function (user) {
            return user.mid;
        });
        db.transaction(function (client, callback) {
            async.waterfall([
                client.select('*').from('likes').where(db.sql.or(db.sql.and({'mid': userId}, db.sql.in('liked', uids)),
                    db.sql.and(db.sql.in('mid', uids), {'liked': userId}))).run,
                function (result, callback) {
                    response.users.forEach(function (user) {
                        user.like = 0;
                        user.likeMe = 0;
                    });
                    if (result.rows && result.rows.length > 0) {
                        var map = response.users.reduce(function (map, user, index) {
                            map[user.mid] = index;
                            return map;
                        }, {});
                        for (var i = 0; i < result.rows.length; ++i) {
                            if (result.rows[i].mid == userId) {
                                response.users[map[result.rows[i].liked]].like = result.rows[i].status;
                            }
                            else {
                                response.users[map[result.rows[i].mid]].likeMe = result.rows[i].status;
                            }
                        }
                        response.users = response.users.filter(function (user) {
                            return user.like == 0;
                        });
                    }
                    callback(null, response.users);
                }
            ], callback);
        }, function (error, result) {
            if (error)
                next(error);
            response.json(result);
        });
    }
    catch (error) {
        next(error);
    }
};