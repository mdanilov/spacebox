var os = require('os');
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
    try
    {
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

exports.getLikes = function (request, response, next) {
    try
    {
        var id = request.session.mid;
        DB.query({ text: "SELECT * FROM likes WHERE mid = $1;",  values: [ id ]},
            function (results) {
                if (results.rows) {
                    log.info('VK user %d have likes from users: %s', id, results.rows);
                    response.json(results.rows);
                }
                else {
                    log.info('VK user %d haven\'t likes', id);
                    response.end();
                }
            });
    }
    catch (error) {
        next(error);
    }
};

exports.addLike = function (request, response, next) {
    try
    {
        var id = request.session.mid;
        DB.query({
            text: "INSERT INTO likes (mid, liked) VALUES ($1, $2);",
            values: [ id, request.query.id ]},
            function (results) {
                if (results.rows) {
                    log.info('User %d liked user %d', id, request.query.id);
                }
                else {
                    log.info('User %d haven\'t like for user %d', id, request.query.id);
                }
                response.end();
            });
    }
    catch (error) {
        next(error);
    }
};

exports.removeLike = function (request, response, next) {
    try
    {
        var id = request.session.mid;
        DB.query({
            text: "DELETE * FROM likes WHERE mid = $1 AND liked = $2;",
            values: [ id, request.query.liked ]},
            function (results) {
                if (results.rows) {
                    log.info('User %d disliked user %d', id, request.query.liked);
                }
                else {
                    log.info('User %d haven\'t like for user %d', id, request.query.liked);
                }
                response.end();
            });
    }
    catch (error) {
        next(error);
    }
};

exports.addUser = function (request, response, next) {
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
            text: "SELECT mid, latitude, longitude, " +
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
                response.json(results[2].rows);
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
