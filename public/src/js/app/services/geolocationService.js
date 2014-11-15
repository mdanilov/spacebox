function GeolocationService ($http, $log, $q, ConfigService, ErrorHandler) {

    var GeolocationService = {};

    GeolocationService.asyncGetCurrentPosition = function () {
        var deferred = $q.defer();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                deferred.resolve(position);
            }, function () {
                ErrorHandler.handleNoGeolocation(true);
                deferred.reject();
            });
        }
        else {
            ErrorHandler.handleNoGeolocation(false);
            deferred.reject();
        }
        return deferred.promise;
    };

    GeolocationService.asyncGetUserPositions = function (options) {
        var deferred = $q.defer();
        GeolocationService.asyncGetCurrentPosition().then(function (position) {
            var data = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                options: options
            };
            $http.post(ConfigService.SERVER_URL + '/getUsers', data).
                success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(new HttpError(status, 'get users request failed'));
                });
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
    };

    return GeolocationService;
}

angular.module('spacebox').factory('GeolocationService',
    ['$http', '$log', '$q', 'ConfigService', 'ErrorHandler', GeolocationService]);
