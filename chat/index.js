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

        socket.on('join', function (id) {
            socket.join(id);
        });

        socket.on('disconnect', function () {
            log.info('User disconnected');
        });

        socket.on('typing', function (message) {
            socket.broadcast.to(message.to).json.emit('typing', message);
        });

        socket.on('message', function (message) {
            if (!message || !message.date) {
                return;
            }

            db.insert('messages', {
                'from_id': message.from_id,
                'user_id': message.user_id,
                'body': message.body,
                'date': new Date(message.date).toUTCString()
            }).run();

            log.info('Socket message received: ', message);

            socket.broadcast.to(message.to).json.emit('incoming_message', message);
        });
    });
};