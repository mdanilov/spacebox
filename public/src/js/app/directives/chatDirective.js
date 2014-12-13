function chatDirective ($log, UserService, ConfigService, MessagesService) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            user: '=',
            messages: '=',
            close: '&onClose'
        },
        templateUrl: 'src/js/app/templates/chat.html',
        link: function (scope, element, attrs) {
            var messagesElement = $("#spMessages");
            var scrollElement = $('.sp-messages-content');
            var textAreaElement = $("#spInput");
            var sendButtonElement = $("#spSendButton");
            var lastMessageElement = null;
            var lastTime = null;
            var userGetId = scope.user.info.id;
            var userSendId = UserService.getInfo().id;

            for (var i = scope.messages.length - 1; i >= 0; --i) {
                createMessage(scope.messages[i]);
            }

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
                var messageElement = $('<div class="sp-message">' + message.body + '</div>');
                var cssClass = message.out ? 'sp-message-sent' : 'sp-message-received';
                messageElement.addClass(cssClass);

                appendDate(new Date(message.date));

                if (lastMessageElement && lastMessageElement.hasClass(cssClass)) {
                    lastMessageElement.removeClass('sp-message-last');
                }
                lastMessageElement = messageElement;
                lastMessageElement.addClass('sp-message-last');

                messagesElement.append(messageElement);
                scrollElement.scrollTop(scrollElement.prop('scrollHeight'));
            }

            var socket = io.connect(ConfigService.SERVER_URL);
            socket.on('connect', function () {
                $log.debug('Connected to the chat');

                socket.emit('join', userSendId);

                socket.on('disconnect', function () {
                    $log.debug('Disconnected from the chat');
                });

                socket.on('incoming_message', function (message) {
                    message.out = 0;
                    if (message.from_id == userGetId) {
                        createMessage(message);
                    }
                });
            });

            scope.isTyping = false;

            scope.$watch(scope.user.mid, function () {
                scope.isTyping = false;
                scope.message = '';
                //messagesElement.empty();
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
                        from_id: userSendId,
                        user_id: userGetId,
                        body: text,
                        out: 1,
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

            scope.hasMessages = function () {
                return lastTime != null;
            };

            scope.startTyping = function () {
                if (!scope.isTyping && scope.message.length > 0) {
                    sendButtonElement.addClass('sp-active');
                    scope.isTyping = true;
                }
                else if (scope.message.length == 0) {
                    sendButtonElement.removeClass('sp-active');
                }
            };
        }
    };
}

angular.module('spacebox').directive('spChat',
    ['$log', 'UserService', 'ConfigService', 'MessagesService', chatDirective]);
