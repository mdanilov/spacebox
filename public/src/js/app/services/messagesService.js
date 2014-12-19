function MessagesService ($log, $q, $http, ConfigService, UserService) {

    var MessagesService = {};
    var _userId = UserService.getInfo().id;
    var _listener = null;
    var _dialogs = {};

    function pushMessage (message) {
        var id = message.out ? message.user_id : message.from_id;
        if (angular.isUndefined(_dialogs[id])) {
            _dialogs[id] = [];
        }
        _dialogs[id].push(message);
    }

    var socket = io.connect(ConfigService.SERVER_URL);
    socket.on('connect', function () {
        $log.debug('Connected to the chat');

        socket.emit('join', _userId);

        socket.on('disconnect', function () {
            $log.debug('Disconnected from the chat');
        });

        socket.on('incoming_message', function (message) {
            message.out = 0;
            pushMessage(message);
            if (_listener) {
                _listener(message);
            }
        });
    });

    MessagesService.sendMessage = function (message) {
        socket.emit('message', message);
        pushMessage(message);
    };

    MessagesService.onMessage = function (fn) {
        _listener = fn;
    };

    MessagesService.getHistory = function (user_id) {
        return _dialogs[user_id];
    };

    MessagesService.asyncLoadHistory = function (user_id) {
        var offset = _dialogs[user_id] ? _dialogs[user_id].length : 0;
        return $http.post(ConfigService.SERVER_URL + '/messages.getHistory',
            {user_id: user_id, offset: offset}
        ).then(function (response) {
            var messages = response.data.items;
            if (angular.isUndefined(_dialogs[user_id])) {
                _dialogs[user_id] = messages.reverse();
            }
            else {
                var i = 0;
                while (i < messages.length &&
                    messages[i].id > _dialogs[user_id][0].id) {
                    i++;
                }

                if (i < messages.length) {
                    _dialogs[user_id] = messages.slice(i).reverse().concat(_dialogs[user_id]);
                }
            }
        },
        function (response) {
            return $q.reject(new HttpError(response.status, 'messages.getHistory request failed'));
        });
    };

    return MessagesService;
}

angular.module('spacebox').factory('MessagesService',
    ['$log', '$q', '$http', 'ConfigService', 'UserService', MessagesService]);
