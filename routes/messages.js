var log = require('../utils/log')(module);
var async = require('async');
var config = require('../config/index');
var db = require('pg-bricks').configure(config.get('database:connection'));

exports.markAsRead = function (request, response, next) {
    db.transaction(function (client, callback) {
        var whereSql = {'user_id': parseInt(request.session.mid)};
        whereSql = db.sql.and(whereSql, request.body.start_message_id ?
            db.sql.gte('id', request.body.start_message_id) : db.sql.in('id', request.body.message_ids));

        client.update('messages').set('read_state', true).where(whereSql).run(callback);
    }, function (error, result) {
        error = error || result.error;
        if (error) {
            next(error);
        }
        else {
            response.end();
        }
    });
};

exports.get = function (request, response, next) {
    var res = {};
    db.transaction(function (client, callback) {
        var out = request.body.out || 0;
        var user_id = parseInt(request.session.mid);
        var whereSql = out ? {'from_id': user_id} : {'user_id': user_id};

        async.waterfall([
            client.select('read_state, COUNT(*)').from('messages')
                .where(whereSql).groupBy('read_state').run,
            function (result, callback) {
                res.count = 0;
                for (var i = 0; i < result.rowCount; ++i) {
                    res.count += parseInt(result.rows[i].count);
                    if (result.rows[i].read_state === false) {
                        res.unread = parseInt(result.rows[i].count);
                    }
                }

                if (res.count > 0) {
                    var offset = request.body.offset || 0;
                    var count = request.body.count || 20;

                    if (request.body.last_message_id) {
                        whereSql = db.sql.and(whereSql, db.sql.gt('id', request.body.last_message_id));
                    }

                    var selectSql = out ? '*, 1 AS out' : '*, 0 AS out';

                    client.select(selectSql).from('messages').where(whereSql)
                        .orderBy('id DESC').limit(count).offset(offset).run(callback);
                }
                else {
                    callback(null, {rows: []});
                }
            }
        ], callback);
    }, function (error, result) {
        error = error || result.error;
        if (error) {
            next(error);
        }
        else {
            res.items = result.rows;
            response.json(res);
        }
    });
};

exports.getDialogs = function (request, response, next) {
    db.transaction(function (client, callback) {
        var current_id = parseInt(request.session.mid);
        var res = {count: 0, items: []};
        async.waterfall([
            function (callback) {
                var query = db.select('MAX(id)').from('messages').where({'user_id': current_id}).groupBy('from_id');
                client.select().from('messages')
                    .where(db.sql.in('id', query)).run(callback);
            },
            function (result, callback) {
                if (result.error) {
                    callback(result.error);
                }
                else if (result.rows.length > 0) {
                    res.count = result.rows.length;
                    res.items = result.rows.map(function (row) {
                         return {message: row};
                    });

                    db.select('COUNT(*), from_id').from('messages')
                        .where(db.sql.and({'user_id': current_id}, {'read_state': false}))
                        .groupBy('from_id').run(callback);
                }
                else {
                    callback(null, {rows: []});
                }
            },
            function (result, callback) {
                if (result.error) {
                    callback(result.error);
                }
                else if (result.rows.length > 0) {
                    res.unread_dialogs = result.rows.length;
                    var unreadCounts = result.rows.reduce(function (counts, row) {
                        counts[row.from_id] = row.count;
                        return counts;
                    }, {});
                    res.items.forEach(function (item) {
                        var count = unreadCounts[item.message.from_id];
                        if (count) {
                            item.unread = count;
                        }
                    });
                }
                callback(null, res);
            }
        ], callback);
    }, function (error, result) {
        if (error) {
            next(error);
        }
        else {
            response.json(result);
        }
    });
};

exports.getHistory = function (request, response, next) {
    var res = {};
    db.transaction(function (client, callback) {
        var current_id = parseInt(request.session.mid);
        var user_id = request.body.user_id;
        async.waterfall([
            client.select('read_state, COUNT(*)').from('messages')
                .where(db.sql.or(db.sql.and({'from_id': current_id}, {'user_id': user_id}),
                    db.sql.and({'from_id': user_id}, {'user_id': current_id}))).groupBy('read_state').run,
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

                    var whereSqlIn = {
                        'from_id': user_id,
                        'user_id': current_id
                    };
                    var whereSqlOut = {
                        'from_id': current_id,
                        'user_id': user_id
                    };

                    if (request.body.start_message_id) {
                        var startMessageId = request.body.start_message_id;
                        offset = 0;
                        whereSqlIn = db.sql.and(whereSqlIn, db.sql.lt('id', startMessageId));
                        whereSqlOut = db.sql.and(whereSqlOut, db.sql.lt('id', startMessageId));
                    }

                    client.select('*, 0 AS out').from('messages').where(whereSqlIn)
                        .union(db.sql.select('*, 1 AS out').from('messages').where(whereSqlOut))
                        .orderBy('id DESC').limit(count).offset(offset).run(callback);
                }
                else {
                    callback(null, {rows: []});
                }
            }
        ], callback);
    }, function (error, result) {
        error = error || result.error;
        if (error) {
            next(error);
        }
        else {
            res.items = result.rows;
            response.json(res);
        }
    });
};