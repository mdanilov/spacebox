function friendListItemDirective (MapService) {
    return {
        restrict: 'E',
        transclude: true,
        require: '^spFriendList',
        templateUrl: 'src/js/app/templates/friend-list-item.html',
        link: function (scope, element, attrs, spFriendListCtrl) {
            spFriendListCtrl.addCard(scope);

            scope.onClick = function () {
                if (scope.user.location) {
                    MapService.setCenter(scope.user.location);
                }
                spFriendListCtrl.select(scope);
            };
        }
    };
}

angular.module('spacebox').directive('spFriendListItem',
    ['MapService', friendListItemDirective]);