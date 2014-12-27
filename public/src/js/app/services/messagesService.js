function MessagesService ($log, $q, $http, $rootScope, $timeout, $window, localStorageService, ConfigService, UserService, FriendsService) {

    var MessagesService = {};

    function Dialog (id, messages, count) {
        if (!angular.isArray(messages)) {
            messages = new Array(messages);
        }
        this.id = id;
        this.items = messages || [];
        this.sync = true;
        this.count = count || messages.length;
        this.offset = 0;
    }
    Dialog.createDialog = function (userId, object) {
        return new Dialog(object.items, object.count);
    };
    Dialog.prototype.addMessages = function (messages) {
        var count = 0;
        if (angular.isArray(messages)) {
            if (!this.sync) {
                this.offset += messages.length;
            }

            var merged = this.items.concat(messages)
                .sort(function (a, b) { return a.id - b.id; });
            merged.used = {};
            this.items = merged.filter(function (item) {
                return item.id in merged.used ? 0 : (merged.used[item.id] = 1);
            });
            count = this.items.length - (merged.length - messages.length);
        }
        else {
            if (this.items.indexOf(messages) == -1) {
                if (!this.sync) {
                    this.offset++;
                }
                this.items.push(messages);
                count++;
            }
        }
        if (count > 0) {
            $rootScope.$broadcast('dialog.update', this.id);
        }
        return count;
    };
    Dialog.prototype.getOffset = function () {
        return this.offset;
    };
    Dialog.prototype.last = function () {
        if (this.items.length > 0) {
            return this.items[0];
        }
    };
    Dialog.prototype.getLastUnread = function () {
        if (this.items && this.items.length > 0) {
            for (var i = this.items.length - 1; i >= 0; --i) {
                if (this.items[i].from_id != _userId &&
                    this.items[i].read_state === false) {
                    return this.items[i]
                }
            }
        }
    };
    Dialog.prototype.hasUnread = function () {
        if (this.items && this.items.length > 0) {
            return this.items.some(function (item) {
                return (item.from_id != _userId) && (item.read_state == false);
            });
        }
    };
    Dialog.prototype.synchronize = function (status) {
        if (angular.isDefined(status)) {
            if (status == false) {
                this.offset = 0;
            }
            this.sync = status;
        }
        else {
            return this.sync;
        }
    };
    Dialog.prototype.removeOldMessages = function (count) {
        this.items.splice(count, this.items.length - count);
    };
    Dialog.prototype.getMessages = function (count, startId) {
        var messages = angular.isUndefined(startId) ?
            this.items : this.items.filter(function (message) { return message.id < startId; });
        return messages.slice(-count);
    };
    Dialog.prototype.getPostponedMessages = function () {
        return this.items.filter(function (message) {
            return angular.isUndefined(message.id);
        });
    };

    var storedDialogs = localStorageService.get('messages.dialogs');
    for (var key in storedDialogs) {
        if (storedDialogs.hasOwnProperty(key)) {
            storedDialogs[key] = Dialog.createDialog(key, storedDialogs[key]);
        }
    }
    var _dialogs = {};

    var _userId = UserService.getInfo().id;
    var _lastMessageId = null;
    var _init = false;
    var MESSAGES_COUNT = 20;
    var _outMessagesCounter = 0;
    var readMessages = localStorageService.get('messages.unread') || [];

    function markAsRead () {
        if (readMessages && readMessages.length > 0) {
            readMessages = readMessages.reduce(function (unique, id) {
                if (unique.indexOf(id) < 0) {
                    unique.push(id);
                }
                return unique;
            }, []);
            return $http.post(ConfigService.SERVER_URL + '/messages.markAsRead',
                {message_ids: readMessages, start_message_id: undefined}).then(function () {
                readMessages = [];
                localStorageService.remove('messages.unread');
            }, function (response) {
                localStorageService.set('messages.unread', readMessages);
                return $q.reject(new HttpError(response.status, 'messages.markAsRead request failed'));
            });
        }
    }

    angular.element($window).on('beforeunload', function () {
        angular.forEach(_dialogs, function (dialog) {
           dialog.removeOldMessages(MESSAGES_COUNT);
        });
        localStorageService.set('messages.dialogs', _dialogs);
        markAsRead();
    });

    function pushMessage (message) {
        var userId = message.out ? message.user_id : message.from_id;
        if (angular.isUndefined(_dialogs[userId])) {
            _dialogs[userId] = new Dialog(userId, message);
            $rootScope.$broadcast('dialog.update', userId);
        }
        else {
            _dialogs[userId].addMessages(message);
        }
    }

    function sendPostponedMessages () {
        $log.debug('[messages] Send postponed messages');
        _dialogs.forEach(function (dialog) {
            var messages = dialog.getPostponedMessages();
            messages.forEach(function (message) {
                $log.debug('[messages] Send postponed message', message);
                socket.emit('message', message, function (id) {
                    message.id = id;
                    $rootScope.$broadcast('messages.new', message);
                });
            });
        });
    }

    function updateDialogs (offset, lastMessageId) {
        $log.debug('[messages] Update dialogs using offset=' + offset + ', last_message_id=' + lastMessageId);
        offset = offset || 0;
        lastMessageId = angular.isNumber(lastMessageId) ? lastMessageId : undefined;
        var count = MESSAGES_COUNT;
        $http.post(ConfigService.SERVER_URL + '/messages.get',
            {last_message_id: lastMessageId, offset: offset, count: count}
        ).then(function (response) {
                var messages = response.data.items.reverse();
                $log.debug('[messages] Got new messages', messages);
                messages.forEach(function (message) {
                    if (_dialogs[message.from_id]) {
                        _dialogs[message.from_id].addMessages(message);
                    }
                    else {
                        _dialogs[message.from_id] = new Dialog(message.from_id, message);
                        $rootScope.$broadcast('dialog.update', message.from_id);
                    }
                });

                $rootScope.$broadcast('messages.new', messages);

                if (lastMessageId && messages.length == count) {
                    $timeout(angular.bind(this, updateDialogs, offset + count, lastMessageId));
                }
            },
            function (response) {
                return $q.reject(new HttpError(response.status, 'messages.get request failed'));
            });
    }

    var socket = io.connect(ConfigService.SERVER_URL);
    socket.on('connect', onConnect);
    function onIncomingMessage (message) {
        message.out = 0;
        message.read_state = false;
        $log.debug('[messages][socket] New incoming message', message);
        pushMessage(message);
        $rootScope.$broadcast('messages.new', message);
    }
    function onDisconnect () {
        $log.debug('[messages][socket] Disconnected from the server');
        socket.removeListener('incoming_message', onIncomingMessage);
        socket.removeListener('disconnect', onDisconnect);
        socket.on('connect', onConnect);
        angular.forEach(_dialogs, function (dialog) {
            dialog.synchronize(false);
        });
    }
    function onConnect () {
        $log.debug('[messages][socket] Socket connected to the server');
        socket.removeListener('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('incoming_message', onIncomingMessage);
        socket.emit('join', _userId);

        markAsRead();

        if (_init && _dialogs.length > 0) {
            sendPostponedMessages();
            var lastMessageId = _dialogs.reduce(function (last, dialog) {
                var message = dialog.last();
                if (message && (message.id - last > 0)) {
                    last = message.id;
                }
                return last;
            }, 0);
            updateDialogs(0, parseInt(lastMessageId));
        }
        else {
            $log.debug('[messages] Initialize friends dialogs');
            FriendsService.asyncGetFriends().then(function (friends) {
                angular.forEach(friends, function (friend) {
                    asyncGetHistory(friend.mid, MESSAGES_COUNT);
                });
            });
        }
    }

    function asyncGetHistory (userId, count, startId) {
        var dialog = _dialogs[userId];
        var offset = 0;
        if (angular.isDefined(dialog)) {
            offset = dialog.getOffset();
            var lastMessage = dialog.last();
            if (lastMessage && dialog.synchronize()) {
                var startMessageId = parseInt(lastMessage.id);
            }
        }

        $log.debug('[messages] Get dialog history user_id=' + userId +
            ', offset=' + offset + ', start_message_id=' + startMessageId);

        return $http.post(ConfigService.SERVER_URL + '/messages.getHistory',
            {user_id: userId, offset: offset, start_message_id: startMessageId}
        ).then(function (response) {
                var messages = response.data.items.reverse();
                $log.debug('[messages] Got history messages', messages);
                if (angular.isUndefined(_dialogs[userId])) {
                    _dialogs[userId] = new Dialog(userId, messages, response.data.count);
                    $rootScope.$broadcast('dialog.update', userId);
                }
                else {
                    var added = _dialogs[userId].addMessages(messages);
                    if (added < messages.length) {
                        _dialogs[userId].synchronize(true);
                    }
                }
                return _dialogs[userId].getMessages(count, startId);
            },
            function (response) {
                return $q.reject(new HttpError(response.status, 'messages.getHistory request failed'));
            });
    }

    MessagesService.markAsRead = function (messages) {
        function markAsRead (message) {
            if (!message.read_state) {
                message.read_state = true;
                readMessages.push(parseInt(message.id));
            }
        }
        if (angular.isArray(messages) && messages.length > 0) {
            messages.forEach(function (message) {
                markAsRead(message);
            });
        }
        else if (angular.isObject(messages)) {
            markAsRead(messages);
        }
    };

    MessagesService.getDialog = function (userId) {
        return _dialogs[userId];
    };

    MessagesService.sendMessage = function (message) {
        message.client_id = _outMessagesCounter++;
        message.read_state = false;
        $timeout(function () {
            socket.emit('message', message, function (id) {
                if (id) {
                    message.id = id;
                    $log.debug('[messages][socket] Message received', message);
                    $rootScope.$broadcast('messages.new', message);
                }
            });
        });
        pushMessage(message);
    };

    MessagesService.asyncGetMessages = function (userId, count, startId) {
        if (angular.isDefined(_dialogs[userId])) {
            var messages = _dialogs[userId].getMessages(count, startId);
            if (messages.length < count) {
                return asyncGetHistory(userId);
            }
            else {
                $log.debug('[messages] Return stored messages', messages);
                var deferred = $q.defer();
                deferred.resolve(messages);
                return deferred.promise;
            }
        }
        else {
            return asyncGetHistory(userId);
        }
    };

    return MessagesService;
}

angular.module('spacebox').factory('MessagesService',
    ['$log', '$q', '$http', '$rootScope', '$timeout', '$window', 'localStorageService', 'ConfigService', 'UserService', 'FriendsService', MessagesService]);
