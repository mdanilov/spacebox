﻿var util = require('util');
var async = require('async');
var pg = require('pg');
var log = require('../utils/log')(module);
var config = require('../config/index');

var db = require('pg-bricks').configure(config.get('database:connection'));

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
                        new Date().getTime() - config.get('database:options:clearInterval')
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

    return {
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

function createFriendship (id1, id2) {
    DB.query({text: "INSERT INTO friends (mid1, mid2, date) VALUES ($1, $2, $3);",
            values: [ id1, id2, new Date().toUTCString() ]},
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

exports.changeLikeStatus = function (request, response, next) {
    try {
        var id = request.session.mid;
        var status = request.query.status;
        DB.query({
            text: "INSERT INTO likes (mid, liked, status, timestamp) VALUES ($1, $2, $3, $4);",
            values: [ id, request.query.id, status, new Date().toUTCString() ]},
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

exports.get = function (request, response, next) {
    db.transaction(function (client, callback) {
        var id = request.session.mid;
        async.waterfall([
            function (callback) {
                var where = util.format(
                    "WHERE earth_box(ll_to_earth(%d, %d), %d) @> ll_to_earth(latitude, longitude) AND mid != %d ",
                    request.body['latitude'],
                    request.body['longitude'],
                    request.body['options'].radius,
                    id);

                var sex = request.body.options.sex;
                if (sex && sex != 0) {
                    where += util.format("AND sex = %d ", sex);
                }

                var interval = request.body.options.ageInterval;
                if (interval) {
                    where += util.format("AND (age > %d AND age < %d OR age = -1) ",
                        interval.bottom,
                        interval.top);
                }

                // TODO: check it
                //if (config.get('database:dateRange') !== undefined) {
                //    where += util.format("AND timestamp > '%s' ",
                //        new Date(new Date().getTime() - config.get('database:dateRange')).toUTCString());
                //}

                var sql =
                    "SELECT mid, timestamp, " +
                    "earth_distance(ll_to_earth($1, $2), ll_to_earth(latitude, longitude)) AS distance " +
                    "FROM users " +
                    where +
                    "ORDER BY distance ASC;";

                client.query(sql, [ request.body['latitude'], request.body['longitude'] ], callback);
            }
        ], callback);
    }, function (error, result) {
        error = error || result.error;
        if (error) {
            next(error);
        }

        if (result && result.rows && (result.rows.length > 0)) {
            response.users = result.rows;
            next();
        }
        else {
            response.end();
        }
    });
};
