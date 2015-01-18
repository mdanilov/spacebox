function LocationService ($rootScope, $q, $timeout, $log, $cookieStore) {

    var LocationService = {};

    var location = {
        position: null,
        promise: null,
        resolved: false
    };
    var geolocation = null;
    var watchId = null;

    function onLocationFound (position) {
        location.position = {
            timestamp: position.timestamp,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        location.resolved = true;

        $log.debug('[location] New position found', location.position);
        $cookieStore.put('location', location.position);
        $rootScope.$broadcast('location.found', location.position);
    }

    function onLocationError (error) {
        $log.debug('[location] Sorry, no position available', error);
        if (error.code == 1) {
            throw new LocationError(true);
        }
    }

    function asyncGetCurrentPosition () {
        var deferred = $q.defer();
        geolocation.getCurrentPosition(function (position) {
            onLocationFound(position);
            deferred.resolve(location.position);
        }, function (error) {
            onLocationError(error);
            deferred.reject();
        });
        return deferred.promise;
    }

    if (navigator.geolocation) {
        geolocation = navigator.geolocation;
        $log.debug('[location] Geolocation API is available');
        location.promise = asyncGetCurrentPosition();
        $timeout(function () {
            watchId = geolocation.watchPosition(onLocationFound, onLocationError, {
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
        return $q.when(location.resolved ? location.position : location.promise);
    };

    return LocationService;
}

angular.module('spacebox').factory('LocationService',
    ['$rootScope', '$q', '$timeout', '$log', '$cookieStore', LocationService]);
