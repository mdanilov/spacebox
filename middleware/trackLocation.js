var log = require('../utils/log')(module);
var config = require('../config/index');
var async = require('async');
var db = require('pg-bricks').configure(config.get('database:connection'));

module.exports =  function (request, response, next) {
    if (!(request.session && request.session.mid && request.cookies.location)) {
        return next();
    }

    var location = JSON.parse(unescape(request.cookies.location));
    if (!(location && location.latitude && location.longitude)) {
        return next();
    }

    var prevLocation = request.session.location;
    location.timestamp = Date.now();
    if (prevLocation && prevLocation.timestamp &&
        (location.timestamp - prevLocation.timestamp < config.get('options:trackInterval'))) {
        return next();
    }

    var userId = request.session.mid;
    db.transaction(function (client, callback) {
        async.waterfall([
            client.delete().from('users').where({'mid': userId}).run,
            function (result, callback) {
                var info = {};
                if (request.cookies.user) {
                    info = JSON.parse(unescape(request.cookies.user));
                }
                client.insert('users', {
                    'mid': userId,
                    'latitude': location.latitude,
                    'longitude': location.longitude,
                    'sex': info.sex || 0,
                    'age': info.age || -1,
                    'timestamp': new Date(location.timestamp).toUTCString()
                }).run(callback);
            }
        ], callback);
    }, function (error, result) {
        if (!(error || result.error)) {
            request.session.location = location;
        }

        return next();
    });
};
