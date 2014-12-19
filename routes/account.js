var log = require('../utils/log')(module);
var async = require('async');
var config = require('../config/index');
var db = require('pg-bricks').configure(config.get('database:connection'));

exports.destroy = function (request, response, next) {
    try {
        db.transaction(function (client, callback) {
            var id = request.session.mid;
            async.waterfall([
                client.delete().from('users').where({'mid': id}).run,
                client.delete().from('friends').where(db.sql.or({'mid1': id}, {'mid2': id})).run,
                client.delete().from('likes').where(db.sql.or({'mid': id}, {'liked': id})).run,
                function __destroy(result, callback) {
                    log.info('Destroy the session, removing ', request.session);
                    request.session.destroy(function (error) {
                        callback(error);
                    });
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
