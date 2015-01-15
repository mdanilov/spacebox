function LocationService ($rootScope, $q, $timeout, $log, $cookieStore) {

    var LocationService = {};
    var _location = {
        position: null,
        promise: null,
        resolved: false
    };
    var _watchId = null;

    function onLocationFound (position) {
        _location.position = position;
        _location.resolved = true;
        $cookieStore.put('location', position);
        $rootScope.$broadcast('location.found', position);
        $log.debug('[location] New position found', position);
    }

    function onLocationError (error) {
        $log.debug('[location] Sorry, no position available', error);
        if (error.code == 1) {
            throw new LocationError(true);
        }
    }

    function asyncGetCurrentPosition () {
        var deferred = $q.defer();
        navigator.geolocation.getCurrentPosition(function (position) {
            onLocationFound(position);
            deferred.resolve(position);
        }, function (error) {
            onLocationError(error);
            deferred.reject();
        });
        return deferred.promise;
    }

    if (navigator.geolocation) {
        $log.debug('[location] Geolocation API is available');
        _location.promise = asyncGetCurrentPosition();
        $timeout(function () {
            _watchId = navigator.geolocation.watchPosition(onLocationFound, onLocationError, {
                enableHighAccuracy: true,
                timeout: 27000,
                maximumAge: 30000
            })
        });
    }
    else {
        $log.debug('[location] Geolocation API is NOT available');
        throw new LocationError(false);
    }

    LocationService.getCurrentPosition = function () {
        return $q.when(_location.resolved ? _location.position : _location.promise);
    };

    return LocationService;
}

angular.module('spacebox').factory('LocationService',
    ['$rootScope', '$q', '$timeout', '$log', '$cookieStore', LocationService]);
