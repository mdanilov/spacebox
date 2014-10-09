function ApplicationController ($scope, $log) {
    $log.debug('Initialize application controller...');

    $scope.users = [];
}

angular.module('spacebox')
    .controller('ApplicationController', ['$scope', '$log', ApplicationController]);