function chatDirective ($log, UserService, ConfigService) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            user: '='
        },
        templateUrl: 'src/js/app/templates/chat.html',
        link: function (scope, element, attrs) {
            var messagesElement = $("#spMessages");
            var textAreaElement = $("#spInput").focus();
            var sendButtonElement = $("#spSendButton");
            var lastMessageElement = null;
            var lastTime = null;
            var userGetId = scope.user.info.id;
            var userSendId = UserService.getInfo().id;

            var CHAT_PRINT_DATE_TIMEOUT = 300000; // 5 minutes

            function appendDate (time) {
                if (!lastTime ||
                    (lastTime && (time.getTime() - lastTime > CHAT_PRINT_DATE_TIMEOUT))) {
                    var dateElement = $('<div class="sp-messages-date">' + time.toLocaleDateString() +
                        '<span>' + ', ' + time.toLocaleTimeString() + '</span>' + '</div>');
                    messagesElement.append(dateElement);
                    lastMessageElement = null;
                }
                lastTime = time.getTime();
            }

            function createMessage (message) {
                var messageElement = $('<div class="sp-message">' + message.text + '</div>');
                var cssClass = (message.from == userSendId) ?
                    'sp-message-sent' : 'sp-message-received';
                messageElement.addClass(cssClass);

                appendDate(new Date());

                if (lastMessageElement && lastMessageElement.hasClass(cssClass)) {
                    lastMessageElement.removeClass('sp-message-last');
                }
                lastMessageElement = messageElement;
                lastMessageElement.addClass('sp-message-last');

                messagesElement.append(messageElement);
                messagesElement.scrollTop(messagesElement.prop('scrollHeight'));
            }

            var socket = io.connect(ConfigService.SERVER_URL);
            socket.on('connect', function () {
                $log.debug('Connected to the chat');
                socket.id = userSendId;

                socket.on('disconnect', function () {
                    $log.debug('Disconnected from the chat');
                });

                socket.on('typing', function (message) {
                    if (message.from == userGetId) {
                        $log.debug('User is typing to you...');
                    }
                });

                socket.on('incoming_message', function (message) {
                    if (message.from == userGetId) {
                        createMessage(message);
                    }
                });
            });

            scope.isTyping = false;

            scope.$watch(scope.user, function () {
                scope.isTyping = false;
                scope.message = '';
                messagesElement.empty();
            });

            scope.$watch(scope.isTyping, function () {
                socket.emit('typing', {
                    from: userSendId,
                    to: userGetId
                });
            });

            function sendMessage (text) {
                sendButtonElement.removeClass('sp-active');
                if (scope.message.length > 0) {
                    var message = {
                        from: userSendId,
                        to: userGetId,
                        text: text,
                        date: new Date()
                    };
                    createMessage(message);
                    socket.emit('message', message);
                    scope.message = '';
                }

                textAreaElement.focus();
                scope.isTyping = false;
            }

            scope.onSend = function (event) {
                if (event.which === 13 || event.type == 'click') {
                    event.preventDefault();
                    event.stopPropagation();
                    sendMessage(scope.message);
                }
            };

            scope.startTyping = function () {
                if (!scope.isTyping && scope.message.length > 0) {
                    sendButtonElement.addClass('sp-active');
                    scope.isTyping = true;
                }
            };
        }
    };
}

angular.module('spacebox').directive('spChat',
    ['$log', 'UserService', 'ConfigService', chatDirective]);
