function userListDirective () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'src/js/app/templates/user-list.html'
    };
}

angular.module('spacebox').directive('spaceboxUserList', userListDirective);
