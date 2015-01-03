function ErrorViewController ($scope, $log, $location, $timeout, ErrorHandler, LocationService) {
    $log.debug('Initialize error view controller...');

    var error = ErrorHandler.getLastError();
    var isGeolocationOn = !(error instanceof GeoError);

    if (angular.isUndefined(error) && isGeolocationOn) {
        $location.path('/');
    }

    if (error instanceof Error) {
        $scope.error = error.toString();
    }

    if (!isGeolocationOn) {
        function checkGeolocationStatus () {
            LocationService.asyncGetCurrentPosition().then(function __success () {
                $location.path('/');
            }, function __error () {
                $timeout(checkGeolocationStatus, 2000);
            })
        }
        $timeout(checkGeolocationStatus, 2000);
    }

    $scope.geolocation = isGeolocationOn;
}

angular.module('spacebox').controller('ErrorViewController',
    ['$scope', '$log', '$location', '$timeout', 'ErrorHandler', 'LocationService', ErrorViewController]);
