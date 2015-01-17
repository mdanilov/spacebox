function friendListItemDirective (MessagesService) {
    return {
        restrict: 'E',
        transclude: true,
        require: '^spFriendList',
        templateUrl: 'src/js/app/templates/friend-list-item.html',
        link: function (scope, element, attrs, spFriendListCtrl) {
            spFriendListCtrl.addCard(scope);
            scope.dialog = MessagesService.getDialog(scope.user.mid);

            scope.onClick = function () {
                scope.user.view();
                spFriendListCtrl.select(scope);
            };

            scope.scrollTo = function () {
                element[0].scrollIntoView();
            };

            scope.openChat = function () {
                if (scope.dialog && scope.dialog.hasUnread()) {
                    var lastUnread = scope.dialog.getLastUnread();
                    scope.dialog.markAsRead(lastUnread);
                }
                scope.$parent.chat();
            };

            scope.hasNewEvents = function () {
                return (scope.user.isRecent()) ||
                    (scope.dialog && scope.dialog.hasUnread());
            };
        }
    };
}

angular.module('spacebox').directive('spFriendListItem',
    ['MessagesService', friendListItemDirective]);