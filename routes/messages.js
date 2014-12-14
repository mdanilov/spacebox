var log = require('../utils/log')(module);
var async = require('async');
var config = require('../config/index');
var db = require('pg-bricks').configure(config.get('database:connection'));

exports.get = function (request, response, next) {
    // TODO: not implemented
};

exports.getHistory = function (request, response, next) {
    try {
        var res = {};
        db.transaction(function (client, callback) {
            var current_id = parseInt(request.session.mid);
            var user_id = request.body.user_id;
            async.waterfall([
                client.select('read_state, COUNT(*)').from('messages')
                    .where(db.sql.or({'from_id': current_id, 'user_id': user_id},
                        {'from_id': user_id, 'user_id': current_id})).groupBy('read_state').run,
                function (result, callback) {
                    res.count = 0;
                    for (var i = 0; i < result.rowCount; ++i) {
                        res.count += parseInt(result.rows[i].count);
                        if (result.rows[i].read_state === false) {
                            res.unread = parseInt(result.rows[i].count);
                        }
                    }

                    if (res.count > 0) {
                        var count = request.body.count || 20;
                        var offset = request.body.offset || 0;

                        client.select('*, 0 AS out').from('messages').where({
                            'from_id': user_id,
                            'user_id': current_id
                        }).union(db.sql.select('*, 1 AS out').from('messages').where({
                            'from_id': current_id,
                            'user_id': user_id
                        })).orderBy('id DESC').limit(count).offset(offset).run(callback);
                    }
                    else {
                        callback(null, {rows: []});
                    }
                }
            ], callback);
        }, function __callback (error, result) {
            if (error)
                next(error);
            res.items = result.rows;
            response.json(res);
        });
    }
    catch (error) {
        next(error);
    }
};