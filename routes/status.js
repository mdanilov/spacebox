var log = require('../utils/log')(module);
var async = require('async');
var config = require('../config/index');
var db = require('pg-bricks').configure(config.get('database:connection'));

exports.set = function (request, response, next) {
    try {
        db.transaction(function (client, callback) {
            var mid = parseInt(request.session.mid);
            async.waterfall([
                // TODO: check this statement
                //client.delete().from('status').where({'mid': mid}).run,
                function (callback) {
                    client.query('DELETE FROM status WHERE mid = $1', [mid], callback);
                },
                function (result, callback) {
                    client.insert('status', {'mid': mid, 'text': request.query.text}).run(callback);
                }
            ], callback);
        }, function __callback (error, result) {
            if (error)
                next(error);
            response.end();
        });
    }
    catch (error) {
        next(error);
    }
};

exports.get = function (request, response, next) {
    try {
        var whereExpr = request.query.user_ids ?
            db.sql.in('mid', request.query.user_ids) : {'mid': request.session.mid};
        db.select().from('status').where(whereExpr).run(function (error, result) {
            if (error)
                next(error);
            response.json(result.rows);
        });
    }
    catch (error) {
        next(error);
    }
};