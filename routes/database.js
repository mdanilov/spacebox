﻿var log = require('../utils/log')(module),
    pg = require('pg'),
    config = require('../config/index'),
    os = require('os'),
    async = require('async');

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
        }
    }
})();

/**
 * Method: GET
 * URI: /user
 * */
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
                //"AND mid != users.mid " +
                "ORDER BY distance ASC;",
            values:
            [
                request.query['latitude'],
                request.query['longitude'],
                request.query['radius']
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
