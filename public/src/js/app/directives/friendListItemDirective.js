function friendListItemDirective (MapService, MessagesService) {
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
                scope.user.new = false;
                if (scope.user.location) {
                    MapService.selectUser(scope.user);
                }
                spFriendListCtrl.select(scope);
            };

            scope.openChat = function () {
                if (scope.message) {
                    scope.message.read_state = true;
                }
                scope.$parent.chat();
            };

            scope.hasUnreadMessage = function () {
                return (scope.user.new === true) ||
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
    ['MapService', 'MessagesService', friendListItemDirective]);