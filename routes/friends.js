var async = require('async');
var log = require('../utils/log')(module);
var config = require('../config/index');
var db = require('pg-bricks').configure(config.get('database:connection'));

exports.get = function (request, response, next) {
    try {
        db.transaction(function (client, callback) {
            var id = request.session.mid;
            async.waterfall([
                function (callback) {
                    client.query('DROP TABLE IF EXISTS temp;', callback);
                },
                function (result, callback) {
                    client.select('mid1 AS id, date').from('friends').where({'mid2': id})
                        .union(db.sql.select('mid2 AS id, date').from('friends').where({'mid1': id}))
                        .intoTemp('temp').run(callback);
                },
                function (result, callback) {
                    client.select('temp.id AS mid, date, latitude, longitude, timestamp, text AS status').from('temp')
                        .leftJoin('users', {'temp.id': 'users.mid'})
                        .leftJoin('status', {'temp.id': 'status.mid'}).run(callback);
                }
            ], callback);
        }, function (error, result) {
            if (error) {
                next(error);
            }
            else if (result) {
                if (result.error) {
                    next(result.error);
                }
                else {
                    response.json(result.rows);
                }
            }
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
                function (result, callback) {
                    client.update('likes').set('status', -1)
                        .where(db.sql.and({'mid': mid}, {'liked': user_id})).run(callback);
                }
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
