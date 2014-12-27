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
            var messagesElement = angular.element('#spMessages');
            var loadingElement = angular.element('<div class="sp-messages-loading">' +
                '<i class="fa fa-circle-o-notch fa-spin"></i></div>');
            var scrollElement = angular.element('.sp-messages-content').on('scroll', onContentScroll);
            var textAreaElement = angular.element('#spInput');
            var sendButtonElement = angular.element('#spSendButton');
            var userSendId = UserService.getInfo().id;

            scope.isTyping = false;
            scope.messages = [];
            scope.isMessages = false;
            scope.user = FriendsService.getFriend(scope.userId).info;

            scope.$watch('userId', function (newValue, oldValue) {
                $log.debug('[chat] User has changed from ' + oldValue + ' to ' + newValue);
                scope.isTyping = false;
                scope.isMessages = false;
                scope.message = '';
                scope.user = FriendsService.getFriend(newValue).info;
                messagesElement.empty();

                MessagesService.asyncGetMessages(newValue, ConfigService.CHAT_MESSAGES_COUNT).then(function (messages) {
                    $log.debug('[chat] Messages loaded', messages);
                    if (angular.isArray(messages) && messages.length > 0) {
                        scope.isMessages = true;
                        prependLoadedHistory(messages);
                        scrollElement.scrollTop(scrollElement.prop('scrollHeight'));
                    }
                });
            });

            function onContentScroll () {
                if (scope.isMessages && scrollElement.scrollTop() == 0) {
                    var user_id = scope.userId;
                    messagesElement.prepend(loadingElement);
                    var lastMessageElement = messagesElement.find('.sp-message').first();
                    var lastId = lastMessageElement.attr('data-sp-message-id');
                    $log.debug('[chat][scroll] Start load messages');
                    MessagesService.asyncGetMessages(user_id, ConfigService.CHAT_MESSAGES_COUNT, lastId).then(function (messages) {
                        loadingElement.remove();
                        $log.debug('[chat][scroll] Messages loaded', messages);
                        if (user_id == scope.userId) {
                            if (angular.isArray(messages) && messages.length > 0) {
                                prependLoadedHistory(messages);
                            }
                        }
                    }, function (error) {
                        loadingElement.remove();
                    });
                }
            }

            function prependLoadedHistory (messages) {
                MessagesService.markAsRead(messages);
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
                        (prevTime && (messages[i].date - prevTime > ConfigService.CHAT_PRINT_TIME))) {
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
                    (prevTime && (time - prevTime > ConfigService.CHAT_PRINT_TIME))) {
                    var date = new Date(time * 1000);
                    var dateElement = $('<div class="sp-messages-date">' + date.toLocaleDateString() +
                        '<span>' + ', ' + date.toLocaleTimeString() + '</span>' + '</div>');
                    messagesElement.append(dateElement);
                    lastMessageElement = null;
                }
                prevTime = time;
            }

            function createMessageElement (message) {
                scope.isMessages = true;
                var messageElement = $('<div class="sp-message">' + message.body + '</div>');
                if (message.id) {
                    messageElement.attr('data-sp-message-id', message.id);
                }
                else {
                    messageElement.attr('data-sp-message-client-id', message.client_id);
                    messageElement.addClass('sending');
                }
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

                return messageElement;
            }

            scope.$on('messages.new', function (event, messages) {
                $log.debug('[chat] Got new incoming messages', messages);
                function processMessage (message) {
                    if (message.from_id == scope.user.id) {
                        MessagesService.markAsRead(message);
                        createMessageElement(message);
                    }
                    else if ((message.from_id == userSendId) && (message.user_id == scope.user.id)) {
                        if (angular.isUndefined(message.client_id)) {
                            throw new Error('message client id is undefined');
                        }
                        var element = messagesElement.find('[data-sp-message-client-id=' + message.client_id + ']');
                        element.attr('data-sp-message-id', message.id);
                        element.removeClass('sending');
                    }
                }
                if (angular.isArray(messages)) {
                    angular.forEach(messages, function (message) {
                        processMessage(message);
                    });
                }
                else {
                    processMessage(messages);
                }
                scope.$apply();
            });

            scope.sendMessage = function (event) {
                if (event.which === 13 || event.type == 'click') {
                    event.preventDefault();
                    event.stopPropagation();
                    if (scope.message.length > 0) {
                        var message = {
                            from_id: userSendId,
                            user_id: scope.user.id,
                            body: scope.message,
                            out: 1,
                            date: Math.round(Date.now()/1000) // UNIX time
                        };
                        $log.debug('[chat] Send message', message);
                        MessagesService.sendMessage(message);
                        createMessageElement(message);
                        scope.message = '';
                    }
                    textAreaElement.focus();
                    scope.startTyping();
                }
            };

            scope.startTyping = function () {
                if (!scope.isTyping && scope.message.length > 0) {
                    sendButtonElement.addClass('sp-active');
                    scope.isTyping = true;
                }
                else if (scope.message.length == 0) {
                    sendButtonElement.removeClass('sp-active');
                    scope.isTyping = false;
                }
            };
        }
    };
}

angular.module('spacebox').directive('spChat',
    ['$log', 'UserService', 'ConfigService', 'MessagesService', 'FriendsService', chatDirective]);
