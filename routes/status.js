var log = require('../utils/log')(module);
var async = require('async');
var config = require('../config/index');
var db = require('pg-bricks').configure(config.get('database:connection'));

exports.set = function (request, response, next) {
    db.transaction(function (client, callback) {
        var mid = parseInt(request.session.mid);
        async.waterfall([
            // TODO: check this statement
            //client.delete().from('status').where({'mid': mid}).run,
            function (callback) {
                client.query('DELETE FROM status WHERE mid = $1', [mid], callback);
            },
            function (result, callback) {
                client.insert('status', {'mid': mid, 'text': request.body.text}).run(callback);
            }
        ], callback);
    }, function (error, result) {
        error = error || result.error;
        if (error) {
            next(error);
        }
        else {
            log.info('status.set');
            response.end();
        }
    });
};

exports.get = function (request, response, next) {
    var userId = request.body.user_id || request.session.mid;
    db.select('text').from('status').where({'mid': userId}).run(function (error, result) {
        error = error || result.error;
        if (error) {
            next(error);
        }
        else {
            var status = result.rows[0] || { text: '' };
            log.info('status.get', status);
            response.json(status);
        }
    });
};