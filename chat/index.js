var config = require('../config/index');
var db = require('pg-bricks').configure(config.get('database:connection'));
var log = require('../utils/log')(module);

module.exports = function (server) {
    var io = require('socket.io')(server);

    if (config.get('NODE_ENV') !== 'development') {
        io.set('log level', 1);
    }

    io.on('connection', function (socket) {
        log.info('User connected');

        socket.on('disconnect', function () {
            log.info('User disconnected');
        });

        socket.on('connect', function (id) {
            socket.id = id;
        });

        socket.on('typing', function (message) {
            socket.broadcast.to(message.to).json.emit('typing', message);
        });

        socket.on('message', function (message) {
            if (!message || !message.date) {
                return;
            }

            db.insert('messages', {
                'user_id_send': message.from,
                'user_id_get': message.to,
                'message': message.text,
                'date': new Date(message.date).toUTCString()
            }).run();

            log.info('Socket message received: ', message);

            socket.broadcast.to(message.to).json.emit('incoming_message', message);
        });
    });
};