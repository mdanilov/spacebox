var async = require('async');
var log = require('../utils/log')(module);
var config = require('../config/index');

var db = require('pg-bricks').configure(config.get('database:connection'));

exports.get = function (request, response, next) {
    try {
        db.transaction(function (client, callback) {
            var id = request.session.mid;
            var uids = [];
            async.waterfall([
                client.select().from('friends').where(db.sql.or({'mid1': id}, {'mid2': id})).run,
                function __selectUserLocations(result, callback) {
                    var users = result.rows;
                    if (users.length > 0) {
                        uids = users.map(function __map(row) {
                            return (row.mid1 == id) ? row.mid2 : row.mid1;
                        });
                        uids.sort(function __compare(a, b) {
                            return a - b;
                        });
                        client.select().from('users').where(db.sql.in('mid', uids)).orderBy('mid').run(callback);
                    }
                    else {
                        callback(null, {rows: []});
                    }
                },
                function __updateFriendsInfo(result, callback) {
                    var friends = [];
                    uids.forEach(function __createFriend(id) {
                        friends.push({ mid: id });
                    });
                    var locations = result.rows;
                    if (locations.length > 0) {
                        for (var i = 0, j = 0; i < uids.length; i++) {
                            if ((j < locations.length) && (uids[i] == locations[j].mid)) {
                                friends[i].location = {
                                    longitude: locations[j].longitude,
                                    latitude: locations[j].latitude,
                                    timestamp: locations[j].timestamp
                                };
                                j++;
                            }
                        }
                    }
                    callback(null, friends);
                }
            ], callback);
        }, function __callback(error, result) {
            if (error)
                next(error);
            response.json(result);
        });
    }
    catch (error) {
        next(error);
    }
};

exports.delete = function (request, response, next) {
    try {
        db.transaction(function (client, callback) {
            var mid = request.session.mid;
            var user_id = request.query.user_id;
            async.waterfall([
                client.delete().from('friends').where(
                    db.sql.or(
                        db.sql.and({'mid1': user_id}, {'mid2': mid}),
                        db.sql.and({'mid1': mid}, {'mid2': user_id})
                    )).run,
                client.update('likes').set('status', -1)
                    .where(db.sql.and({'mid': mid}, {'liked': user_id})).run
            ], callback);
        }, function __callback(error) {
            if (error)
                next(error);
            response.end();
        });
    }
    catch (error) {
        next(error);
    }
};
