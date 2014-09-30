function UserListItemController ($scope, $window) {

    $scope.toggleSelection = function (e) {
        e.preventDefault();
        var url = 'http://vk.com/' + $scope.user.screenName;
        $scope.activeIndex = $scope.$index;
        $window.open(url);
    }
}

angular.module('spacebox')
    .controller('UserListItemController',
    ['$scope', '$window', UserListItemController]);
