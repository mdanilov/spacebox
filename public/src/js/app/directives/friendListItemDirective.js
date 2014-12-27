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
                        scope.message = dialog.getLastUnread();
                        scope.$digest(); // TODO: try to remove
                    }
                }
            }

            updateShownMessage();

            scope.onClick = function () {
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
                return scope.message &&
                    (scope.message.read_state === false);
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