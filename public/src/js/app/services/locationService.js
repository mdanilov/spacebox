function LocationService ($rootScope, $q, $timeout, $log, $cookieStore) {

    var LocationService = {};

    var _location = {
        position: null,
        promise: null,
        resolved: false
    };
    var _geolocation = null;
    var _watchId = null;

    function onLocationFound (position) {
        var location = angular.extend({}, position);
        window.alert(angular.toJson(location));
        _location.position = location;
        _location.resolved = true;
        $cookieStore.put('location', location);
        $rootScope.$broadcast('location.found', location);
        $log.debug('[location] New position found', location);
    }

    function onLocationError (error) {
        $log.debug('[location] Sorry, no position available', error);
        if (error.code == 1) {
            throw new LocationError(true);
        }
    }

    function asyncGetCurrentPosition () {
        var deferred = $q.defer();
        _geolocation.getCurrentPosition(function (position) {
            onLocationFound(position);
            deferred.resolve(position);
        }, function (error) {
            onLocationError(error);
            deferred.reject();
        });
        return deferred.promise;
    }

    if (navigator.geolocation) {
        _geolocation = navigator.geolocation;
        $log.debug('[location] Geolocation API is available');
        _location.promise = asyncGetCurrentPosition();
        $timeout(function () {
            _watchId = _geolocation.watchPosition(onLocationFound, onLocationError, {
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
