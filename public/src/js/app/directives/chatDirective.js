function chatDirective ($log, UserService, ConfigService, MessagesService, FriendsService) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            userId: '=',
            close: '&onClose'
        },
        templateUrl: 'src/js/app/templates/chat.html',
        link: function (scope, element, attrs) {
            var messagesElement = $("#spMessages");
            var scrollElement = $('.sp-messages-content');
            var textAreaElement = $("#spInput");
            var sendButtonElement = $("#spSendButton");
            var userSendId = UserService.getInfo().id;
            var CHAT_PRINT_DATE_TIMEOUT = 60; // 1 minute

            scope.isTyping = false;
            scope.isMessages = false;
            scope.user = FriendsService.getFriend(scope.userId).info;

            scope.$watch('userId', function (newValue) {
                scope.isTyping = false;
                scope.isMessages = false;
                scope.message = '';
                scope.user = FriendsService.getFriend(newValue).info;
                messagesElement.empty();

                var messages = MessagesService.getHistory(newValue);
                if (angular.isArray(messages) && messages.length > 0) {
                    scope.isMessages = true;
                    prependLoadedHistory(messages);
                    scrollElement.scrollTop(scrollElement.prop('scrollHeight'));
                }
                else {
                    MessagesService.asyncLoadHistory(newValue).then(function () {
                        if (scope.userId == newValue) {
                            messages = MessagesService.getHistory(newValue);
                            if (angular.isArray(messages) && messages.length > 0) {
                                prependLoadedHistory(messages);
                            }
                        }
                    });
                }
            });

            scrollElement.on('scroll', function () {
                if (scrollElement.scrollTop() == 0) {
                    var user_id = scope.userId;
                    MessagesService.asyncLoadHistory(user_id).then(function () {
                        if (user_id == scope.userId) {
                            var messages = MessagesService.getHistory(user_id);
                            if (angular.isArray(messages) && messages.length > 0) {
                                prependLoadedHistory(messages);
                            }
                        }
                    });
                }
            });

            function prependLoadedHistory (messages) {
                var element = messagesElement.find(':first-child');
                if (element.length > 0) {
                    var id = parseInt(element.first().attr('data-sp-message-id'));
                    var pos = 0;
                    while (pos < messages.length) {
                        if (messages[pos].id >= id) {
                            break;
                        }
                        pos++;
                    }
                    messages = messages.slice(0, pos);
                }

                var elements = [];
                var prevTime = null;
                var lastMessageElement = null;
                for (var i = 0; i < messages.length; ++i) {
                    var messageElement = $('<div class="sp-message" data-sp-message-id="' + messages[i].id + '">' + messages[i].body + '</div>');
                    var cssClass = messages[i].out ? 'sp-message-sent' : 'sp-message-received';
                    messageElement.addClass(cssClass);

                    if (!prevTime ||
                        (prevTime && (messages[i].date - prevTime > CHAT_PRINT_DATE_TIMEOUT))) {
                        var date = new Date(messages[i].date * 1000);
                        var dateElement = $('<div class="sp-messages-date" data-sp-message-id="' + messages[i].id + '">' + date.toLocaleDateString() +
                            '<span>' + ', ' + date.toLocaleTimeString() + '</span>' + '</div>');
                        elements.push(dateElement);
                        lastMessageElement = null;
                    }
                    prevTime = messages[i].date;

                    if (lastMessageElement && lastMessageElement.hasClass(cssClass)) {
                        lastMessageElement.removeClass('sp-message-last');
                    }
                    lastMessageElement = messageElement;
                    lastMessageElement.addClass('sp-message-last');
                    elements.push(messageElement);
                }
                messagesElement.prepend(elements);
            }

            var prevTime = null;
            var lastMessageElement = null;
            function createDateElement (time) {
                if (!prevTime ||
                    (prevTime && (time - prevTime > CHAT_PRINT_DATE_TIMEOUT))) {
                    var date = new Date(time * 1000);
                    var dateElement = $('<div class="sp-messages-date" data-sp-message-id="999999999">' + date.toLocaleDateString() +
                        '<span>' + ', ' + date.toLocaleTimeString() + '</span>' + '</div>');
                    messagesElement.append(dateElement);
                    lastMessageElement = null;
                }
                prevTime = time;
            }

            function createMessageElement (message) {
                scope.isMessages = true;
                var messageElement = $('<div class="sp-message" data-sp-message-id="999999999">' + message.body + '</div>');
                var cssClass = message.out ? 'sp-message-sent' : 'sp-message-received';
                messageElement.addClass(cssClass);

                createDateElement(message.date);

                if (lastMessageElement && lastMessageElement.hasClass(cssClass)) {
                    lastMessageElement.removeClass('sp-message-last');
                }
                lastMessageElement = messageElement;
                lastMessageElement.addClass('sp-message-last');
                messagesElement.append(messageElement);
                scrollElement.scrollTop(scrollElement.prop('scrollHeight'));
            }

            MessagesService.onMessage(function (message) {
                if (message.from_id == scope.user.id) {
                    createMessageElement(message);
                }
            });

            function sendMessage (text) {
                sendButtonElement.removeClass('sp-active');
                if (scope.message.length > 0) {
                    var message = {
                        from_id: userSendId,
                        user_id: scope.user.id,
                        body: text,
                        out: 1,
                        date: Math.round(Date.now()/1000)
                    };
                    createMessageElement(message);
                    MessagesService.sendMessage(message);
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
                else if (scope.message.length == 0) {
                    sendButtonElement.removeClass('sp-active');
                }
            };
        }
    };
}

angular.module('spacebox').directive('spChat',
    ['$log', 'UserService', 'ConfigService', 'MessagesService', 'FriendsService', chatDirective]);
