function ErrorViewController ($scope, $log, ErrorHandler) {
    $log.debug('Initialize error view controller...');
    $scope.error = ErrorHandler.getLastError().toString();
}

angular.module('spacebox').controller('ErrorViewController',
    ['$scope', '$log', 'ErrorHandler', ErrorViewController]);
