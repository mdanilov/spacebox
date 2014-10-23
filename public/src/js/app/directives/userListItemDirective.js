function userListItemDirective (MapService) {
    return {
        restrict: 'E',
        transclude: true,
        require: '^spUserList',
        link: function (scope, element, attrs, spUserListCtrl) {
            spUserListCtrl.addCard(scope);

            scope.onClick = function () {
                if (scope.user.location) {
                    MapService.setCenter(scope.user.location);
                }
                spUserListCtrl.select(scope);
            };
        },
        templateUrl: 'src/js/app/templates/user-list-item.html'
    };
}

angular.module('spacebox').directive('spUserListItem',
    ['$window', 'VkService', 'MapService', 'MeetService', userListItemDirective]);