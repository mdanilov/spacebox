function GeolocationService ($http, $log, $q) {

    var GeolocationService = {};

    function handleNoGeolocation (errorFlag) {
        if (errorFlag) {
            $log.error('Geolocation is off');
        } else {
            $log.error('Browser doesn\'t support geolocation');
        }
    }

    GeolocationService.asyncGetCurrentPosition = function () {
        var deferred = $q.defer();
        if (navigator.geolocation) {
            deferred.resolve({coords: {latitude: 59.91231, longitude: 30.3224363}});
//            navigator.geolocation.getCurrentPosition(function (position) {
//                deferred.resolve(position);
//            }, function () {
//                handleNoGeolocation(true);
//                deferred.reject();
//            }, { maximumAge: 0, timeout: 5000 });
        }
        else {
            handleNoGeolocation(false);
        }
        return deferred.promise;
    };

    GeolocationService.asyncGetUserPositions = function (radius) {
        var deferred = $q.defer();
        GeolocationService.asyncGetCurrentPosition().then(function (position) {
            var data = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                radius: radius
            };
            $http.get(config.serverUrl + '/getUsers', {params: data}).
                success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
        });
        return deferred.promise;
    };

    return GeolocationService;
}

angular.module('spacebox')
    .factory('GeolocationService', ['$http', '$log', '$q', GeolocationService]);
