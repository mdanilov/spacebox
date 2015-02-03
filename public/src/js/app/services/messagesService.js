function MessagesService ($log, $q, $http, $rootScope, $timeout, $window, localStorageService, ConfigService, UserService) {

    var MessagesService = {};

    function Dialog (id, messages, count) {
        messages = messages || [];

        var self = this;

        self.id = id;
        self.messages = !angular.isArray(messages) ? [messages] : messages;
        self.count = count || self.messages.length;
        self.resolved = false;
        self.last = self.messages.length > 0 ? self.messages[0] : null;

        self.lastUnread = null;
        self.unread = 0;
        if (self.messages.length > 0) {
            self.messages.forEach(function (message) {
                if (message.read_state == false) {
                    self.unread++;
                    if (!angular.isObject(self.lastUnread) || self.lastUnread.id < message.id ) {
                        self.lastUnread = message;
                    }
                }
            });
        }
    }
    Dialog.createDialog = function (object) {
        return new Dialog(object.id, object.messages, object.count);
    };
    Dialog.prototype.addMessages = function (items) {
        if (!angular.isObject(items)) {
            return;
        }

        var count = 0;
        var messages = !angular.isArray(items) ? [items] : items;
        if (angular.isArray(messages)) {
            var merged = this.messages.concat(messages)
                .sort(function (a, b) { return a.id - b.id; });
            merged.used = {};
            this.messages = merged.filter(function (item) {
                return item.id in merged.used ? 0 : (merged.used[item.id] = 1);
            });
            count = this.messages.length - (merged.length - messages.length);

            // update state
            if (this.messages.length > 0) {
                this.last = this.messages[0];
                var self = this;
                this.messages.forEach(function (message) {
                    if (message.read_state === false && !message.out) {
                        if (!angular.isObject(self.lastUnread) || self.lastUnread.id < message.id) {
                            self.lastUnread = message;
                        }
                        self.unread++;
                    }
                });
            }
        }
        return count;
    };
    Dialog.prototype.resolve = function (value) {
        if (value) {
            this.resolved = !!value;
        }
        else {
            return this.resolved;
        }
    };
    Dialog.prototype.getLast = function () {
        return this.last;
    };
    Dialog.prototype.getLastUnread = function () {
        return this.lastUnread;
    };
    Dialog.prototype.hasUnread = function () {
        return this.unread > 0;
    };
    Dialog.prototype.markAsRead = function (message) {
        if (!angular.isObject(message)) {
            return;
        }

        var pos = this.messages.indexOf(message);
        if (pos != -1) {
            this.messages[pos].read_state = true;
            if (this.lastUnread && message.id == this.lastUnread.id) {
                // update last unread message
                for (var i = 0; i < this.messages.length; ++i) {
                    if (this.messages[i].read_state === false && !message.out) {
                        this.lastUnread = this.messages[i];
                        break;
                    }
                }
            }
            this.unread--;
        }
    };
    Dialog.prototype.prepareForSave = function (count) {
        this.messages.splice(count, this.messages.length - count);
    };
    Dialog.prototype.getMessages = function (count, startId) {
        var messages = angular.isUndefined(startId) ?
            this.messages : this.messages.filter(function (message) { return message.id < startId; });
        return messages.slice(-count);
    };
    Dialog.prototype.getPostponedMessages = function () {
        return this.messages.filter(function (message) {
            return angular.isUndefined(message.id);
        });
    };

    var storedDialogs = localStorageService.get('messages.dialogs');
    for (var key in storedDialogs) {
        if (storedDialogs.hasOwnProperty(key)) {
            storedDialogs[key] = Dialog.createDialog(storedDialogs[key]);
        }
    }
    var _dialogs = {};
    var MESSAGES_COUNT = 20;
    var clientIdCounter = 0;
    var readMessages = localStorageService.get('messages.unread') || [];
    var _userId;

    $rootScope.$watch(UserService.getInfo, function (info) {
        if (!angular.isUndefined(info)) {
            _userId = info.id.toString();
        }
    });

    function markMessagesAsRead (messages) {
        function asyncMarkAsRead (messages) {
            // remove duplicates messages
            messages = messages.reduce(function (unique, id) {
                if (unique.indexOf(id) < 0) {
                    unique.push(id);
                }
                return unique;
            }, []);
            return $http.post(ConfigService.SERVER_URL + '/messages.markAsRead',
                {message_ids: messages, start_message_id: undefined}).then(function () {
                    localStorageService.remove('messages.unread');
                    messages = [];
                }, function (response) {
                    localStorageService.set('messages.unread', messages);
                    return $q.reject(new HttpError(response.status, 'messages.markAsRead request failed'));
                });
        }

        return $q.when((angular.isArray(messages) && messages.length > 0) ?
            asyncMarkAsRead(messages) : true);
    }

    function saveDialogs () {
        angular.forEach(_dialogs, function (dialog) {
            dialog.prepareForSave(MESSAGES_COUNT);
        });
        localStorageService.set('messages.dialogs', _dialogs);
        markMessagesAsRead();
    }

    angular.element($window).on('unload', saveDialogs);
    angular.element($window).on('pagehide', saveDialogs);

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
                    createDialog(message.from_id, message);
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
        var userId = message.out ? message.user_id : message.from_id;
        createDialog(userId, message);
        $rootScope.$broadcast('messages.new', message);
    }
    function onDisconnect () {
        $log.debug('[messages][socket] Disconnected from the server');
        socket.removeListener('incoming_message', onIncomingMessage);
        socket.removeListener('disconnect', onDisconnect);
        socket.on('connect', onConnect);
        angular.forEach(_dialogs, function (dialog) {
            dialog.resolve(false);
        });
    }
    function onConnect () {
        $log.debug('[messages][socket] Socket connected to the server');
        socket.removeListener('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('incoming_message', onIncomingMessage);
        socket.emit('join', _userId);

        markMessagesAsRead(readMessages).finally(function () {
            initDialogs();
            sendPostponedMessages();
        });
    }

    function createDialog (userId, messages) {
        var dialog = _dialogs[userId];
        if (angular.isUndefined(dialog)) {
            dialog = new Dialog(userId, messages);
            _dialogs[userId] = dialog;
        }
        else if (!angular.isUndefined(messages)) {
            dialog.addMessages(messages);
        }
        return dialog;
    }

    function initDialogs () {
        return $http.post(ConfigService.SERVER_URL + '/messages.getDialogs').then(function (response) {
            var res = response.data;
            if (res.count > 0) {
                res.items.forEach(function (item) {
                    var message = item.message;
                    createDialog(message.from_id, message);
                });
            }
            $log.debug('[messages] Initialize dialogs', _dialogs);
            $rootScope.$broadcast('dialog.update');
        }, function (response) {
            return $q.reject(new HttpError(response.status, 'messages.getDialogs request failed'));
        });
    }

    function asyncGetHistory (userId, count, startId) {
        var startMessageId = startId ? parseInt(startId) : startId;
        return $http.post(ConfigService.SERVER_URL + '/messages.getHistory',
            {user_id: userId, offset: 0, start_message_id: startMessageId}).then(function (response) {
            var messages = [];
            var res = response.data;
            if (res.count > 0) {
                messages = res.items.reverse();
                $log.debug('[messages] Got history messages', messages);
            }
            var dialog = createDialog(userId, messages);
            if (angular.isUndefined(startId)) {
                dialog.resolve(true);
            }
            messages = dialog.getMessages(count, startId);
            return messages;
        }, function (response) {
            return $q.reject(new HttpError(response.status, 'messages.getHistory request failed'));
        });
    }

    MessagesService.markAsRead = function (unread) {
        if (!angular.isObject(unread)) {
            return;
        }

        var messages = !angular.isArray(unread) ? [unread] : unread;
        if (angular.isArray(messages) && messages.length > 0) {
            messages.forEach(function (message) {
                var userId = message.out ? message.user_id : message.from_id;
                _dialogs[userId].markAsRead(message);
                readMessages.push(parseInt(message.id));
            });
        }
    };

    MessagesService.getDialog = function (userId) {
        return createDialog(userId);
    };

    MessagesService.unreadMessages = function () {
        var unread = 0;
        for (var key in _dialogs) {
            if (_dialogs.hasOwnProperty(key) && _dialogs[key].hasUnread()) {
                unread += _dialogs[key].unread;
            }
        }
        return unread;
    };

    MessagesService.sendMessage = function (message) {
        message.client_id = clientIdCounter++;
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
        var userId = message.out ? message.user_id : message.from_id;
        createDialog(userId, message);
    };

    MessagesService.asyncGetMessages = function (userId, count, startId) {
        var isAsync = true;
        var dialog = _dialogs[userId];
        if (dialog && dialog.resolve()) {
            var messages = dialog.getMessages(count, startId);
            if (messages.length == count) {
                isAsync = false;
            }
        }
        return $q.when(isAsync ? asyncGetHistory(userId, count, startId) : messages);
    };

    return MessagesService;
}

angular.module('spacebox').factory('MessagesService',
    ['$log', '$q', '$http', '$rootScope', '$timeout', '$window', 'localStorageService', 'ConfigService', 'UserService', 'FriendsService', MessagesService]);
