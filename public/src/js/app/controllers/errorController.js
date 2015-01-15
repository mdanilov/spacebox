function ErrorViewController ($scope, $log, $location, ErrorHandler) {
    $log.debug('Initialize error view controller...');

    var error = ErrorHandler.getLastError();
    var isGeolocationOn = !(error instanceof LocationError);

    if (angular.isUndefined(error) && isGeolocationOn) {
        $location.path('/');
    }

    if (error instanceof Error) {
        $scope.error = error.toString();
    }

    if (!isGeolocationOn) {
        $scope.$on('location.found', function () {
            $location.path('/');
        });
    }

    $scope.geolocation = isGeolocationOn;
}

angular.module('spacebox').controller('ErrorViewController',
    ['$scope', '$log', '$location', 'ErrorHandler', ErrorViewController]);
