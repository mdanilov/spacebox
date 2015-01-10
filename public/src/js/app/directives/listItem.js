function friendListItemDirective (MessagesService) {
    return {
        restrict: 'E',
        transclude: true,
        require: '^spFriendList',
        templateUrl: 'src/js/app/templates/friend-list-item.html',
        link: function (scope, element, attrs, spFriendListCtrl) {
            spFriendListCtrl.addCard(scope);

            function updateShownMessage () {
                if (scope.user) {
                    var dialog = MessagesService.getDialog(scope.user.mid);
                    if (dialog && dialog.hasUnread()) {
                        scope.$evalAsync(function (scope) {
                            scope.message = dialog.getLastUnread();
                        });
                    }
                }
            }

            updateShownMessage();

            scope.onClick = function () {
                scope.user.view();
                spFriendListCtrl.select(scope);
            };

            scope.scrollTo = function () {
                element[0].scrollIntoView();
            };

            scope.openChat = function () {
                if (scope.message) {
                    scope.message.read_state = true;
                }
                scope.$parent.chat();
            };

            scope.hasUnreadMessage = function () {
                return (scope.user.isRecent()) ||
                    (scope.message && scope.message.read_state === false);
            };

            scope.$on('dialog.update', function (event, dialogId) {
                if (scope.user && scope.user.mid == dialogId) {
                    updateShownMessage();
                }
            });
        }
    };
}

angular.module('spacebox').directive('spFriendListItem',
    ['MessagesService', friendListItemDirective]);