﻿var os = require('os');
var async = require('async');
var pg = require('pg');
var log = require('../utils/log')(module);
var config = require('../config/index');

var DB = (function() {
    var options = config.get('database:connection');
    var clearInterval = config.get('database:options:clearInterval');

    if (clearInterval) {
        setInterval(function () {
            pg.connect(options, function (error, client, done) {
                if (error)
                    throw error;
                client.query("DELETE FROM users WHERE timestamp < $1",
                    [
                        os.uptime() - config.get('database:options:clearInterval')
                    ],
                    function (error) {
                        if (error)
                            throw error;
                        log.info('Database cleared');
                    });
                done();
            });
        }, config.get('database:options:clearInterval') * 1000);
    }

    function createTask(sql, client) {
        return function(cb) {
            client.query(sql, function(error) {
                if (error)
                    throw error;
                cb(null, arguments[1]);
            });
        }
    }

    return {
        series: function(sqls, next) {
            pg.connect(options, function(error, client, done) {
                if (error)
                    throw error;

                var tasks = [];
                for (var i = 0; i < sqls.length; i++) {
                    tasks[i] = createTask(sqls[i], client);
                }

                async.series(tasks, function (error, results) {
                    if (error)
                        throw error;

                    done();
                    next(error, results);
                });
            });
        },

        query: function (sql, callback) {
            pg.connect(options, function (error, client, done) {
                if (error) throw error;
                client.query(sql, function (error, result) {
                    if (error) throw error;
                    callback(result);
                });
                done();
            });
        }
    }
})();

exports.removeUser = function (request, response, next) {
    try {
        var id = request.session.mid;
        DB.query({ text: "DELETE FROM users WHERE mid = $1;",  values: [ id ]},
            function () {
                log.info('VK user %d is deleted from database', id);
                next();
            });
    }
    catch (error) {
        next(error);
    }
};

exports.selectLikes = function (request, response, next) {
    try {
        var userId = request.session.mid;
        // TODO: it can be done in two separate queries, may be it would be faster
        DB.query({ text: "SELECT * FROM likes WHERE mid = $1 OR liked = $1;",  values: [ userId ]},
        function (results) {
            response.likesForUsers = [];
            response.likesFromUsers = [];
            if (results.rows.length != 0) {
                for (var i = 0; i < results.rows.length; i++) {
                    if (results.rows[i].mid == userId) {
                        response.likesForUsers[results.rows[i].liked] = results.rows[i].status;
                    }
                    else {
                        response.likesFromUsers[results.rows[i].mid] = results.rows[i].status;
                    }
                }

                function getFormatString (users) {
                    var keys = [];
                    for (var key in users) {
                        if (users.hasOwnProperty(key)) {
                            keys.push('{ id: ' + key + ', ' + 'status: ' + users[key] + ' }');
                        }
                    }
                    return keys.join(', ');
                }

                log.info('The user id%d has likes for users: %s',
                    userId, getFormatString(response.likesForUsers));

                log.info('The user id%d has likes from users: %s',
                    userId, getFormatString(response.likesFromUsers));
            }
            else {
                log.info('There are no likes for user id', userId);
            }
            next();
        });
    }
    catch (error) {
        next(error);
    }
};

function createFriendship (id1, id2) {
    DB.query({text: "INSERT INTO friends (mid1, mid2, timestamp) VALUES ($1, $2, $3);",
        values: [ id1, id2, os.uptime() ]},
        function (results) {
            log.info('Users id%d and id%d are friends now', id1, id2);
        });
}

function updateRelations (request) {
    if (request.query.status == 1) {
        var mid = request.session.mid;
        DB.query({ text: "SELECT * FROM likes WHERE mid = $1 AND liked = $2 AND status = 1;",
            values: [ request.query.id, mid ]},
            function (results) {
                if (results.rows.length != 0) {
                    createFriendship(mid, results.rows[0].mid);
                }
            });
    }
}

function GetLocations (ids, callback) {
    DB.query("SELECT * FROM users WHERE mid IN (" + ids.join(',') + ") ORDER BY mid;",
        function (results) {
            callback(results.rows);
        });
}

exports.selectFriends = function (request, response, next) {
    try {
        var id = request.session.mid;
        DB.query({ text: "SELECT * FROM friends WHERE mid1 = $1 OR mid2 = $1;",  values: [ id ]},
            function (results) {
                var uids = [];
                for (var i = 0; i < results.rows.length; i++) {
                    if (results.rows[i].mid1 == id) {
                        uids.push(results.rows[i].mid2);
                    }
                    else {
                        uids.push(results.rows[i].mid1);
                    }
                }
                uids.sort(function (a,b) { return a - b; });
                GetLocations(uids, function (locations) {
                    var friends = [];
                    for (var i = 0, j = 0; i < uids.length; i++) {
                        friends.push({ mid: uids[i] });
                        if (locations.length && (j < locations.length) && (uids[i] == locations[j].mid)) {
                            friends[i].location = {
                                longitude: locations[j].longitude,
                                latitude: locations[j].latitude,
                                timestamp: locations[j].timestamp
                            };
                            j++;
                        }
                    }
                    response.json(friends);
                });
            });
    }
    catch (error) {
        next(error);
    }
};

exports.changeLikeStatus = function (request, response, next) {
    try {
        var id = request.session.mid;
        var status = request.query.status;
        DB.query({
            text: "INSERT INTO likes (mid, liked, status, timestamp) VALUES ($1, $2, $3, $4);",
            values: [ id, request.query.id, status, os.uptime() ]},
            function (results) {
                if (status == 1) {
                    log.info('User id%d liked user id%d', id, request.query.id);
                }
                else if (status == -1) {
                    log.info('User id%d disliked user id%d', id, request.query.id);
                }
                updateRelations(request);
                response.end();
            });
    }
    catch (error) {
        next(error);
    }
};

exports.deleteLike = function (request, response, next) {
    try {
        var id = request.session.mid;
        DB.query({
            text: "DELETE FROM likes WHERE mid = $1 AND liked = $2;",
            values: [ id, request.query.id ]},
            function (results) {
                if (results) {

                }
                log.info('User %d disliked user %d', id, request.query.id);
                response.end();
            });
    }
    catch (error) {
        next(error);
    }
};

exports.insertUserAndSelectNearUsers = function (request, response, next) {
    var sqls =
    [
        {
            text: "DELETE FROM users WHERE mid = $1;",
            values: [request.session.mid]
        },
        {
            text: "INSERT INTO users (mid, latitude, longitude, timestamp) VALUES ($1, $2, $3, $4);",
            values:
            [
                request.session.mid,
                request.query['latitude'],
                request.query['longitude'],
                os.uptime()
            ]
        },
        {
            text: "SELECT * , " +
                "earth_distance(ll_to_earth($1, $2), ll_to_earth(users.latitude, users.longitude)) AS distance " +
                "FROM users " +
                "WHERE earth_box(ll_to_earth($1, $2), $3) @> ll_to_earth(users.latitude, users.longitude) " +
                "AND mid != $4 " +
                "ORDER BY distance ASC;",
            values:
            [
                request.query['latitude'],
                request.query['longitude'],
                request.query['radius'],
                request.session.mid
            ]
        }
    ];

    try
    {
        DB.series(sqls, function(error, results) {
            if (results[2].rows) {
                response.users = results[2].rows;
                next();
            }
            else {
                response.end();
            }
        });
    }
    catch(error) {
        next(error);
    }
};
