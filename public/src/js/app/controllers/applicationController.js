function ApplicationController ($scope, $log) {
    $log.debug('Initialize application controller...');

    $scope.users = [];
    $scope.photos = [];
}

angular.module('spacebox')
    .controller('ApplicationController', ['$scope', '$log', ApplicationController]);