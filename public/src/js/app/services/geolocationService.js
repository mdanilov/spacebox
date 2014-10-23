function GeolocationService ($http, $log, $q) {

    var GeolocationService = {};

    function handleNoGeolocation (errorFlag) {
        if (errorFlag) {
            $log.error('Geolocation is off');
        } else {
            $log.error('Browser doesn\'t support geolocation');
        }
    }

    GeolocationService.asyncGetCurrentPosition = function (callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                callback(position);
            }, function () {
                handleNoGeolocation(true);
            }, { maximumAge: 60000 });
        }
        else {
            handleNoGeolocation(false);
        }
    };

    GeolocationService.getNearUsers = function (radius, callback) {
        GeolocationService.asyncGetCurrentPosition(function (position) {
            var data = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                radius: radius
            };
            $http.get(config.serverUrl + '/getUsers', {params: data}).
                success(function (data, status, headers, config) {
                    callback(null, data);
                }).
                error(function (data, status, headers, config) {
                    callback(status);
                });
        });
    };

    return GeolocationService;
}

angular.module('spacebox')
    .factory('GeolocationService', ['$http', '$log', '$q', GeolocationService]);
