function GeolocationService ($http, $log, $q, ConfigService, ErrorHandler) {

    var GeolocationService = {};

    GeolocationService.asyncGetCurrentPosition = function () {
        var deferred = $q.defer();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                deferred.resolve(position);
            }, function () {
                deferred.reject(new GeoError(true));
            });
        }
        else {
            deferred.reject(new GeoError(false));
        }
        return deferred.promise;
    };

    GeolocationService.asyncGetUserPositions = function (options) {
        return GeolocationService.asyncGetCurrentPosition().then(function (position) {
            var params = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                options: options
            };
            return $http.post(ConfigService.SERVER_URL + '/users.get', params).then(
                function __success (response) {
                    $log.debug('Get near users ', response.data);
                    return response.data;
                },
                function __error (response) {
                    return $q.reject(new HttpError(response.status, 'get users request failed'));
                });
        });
    };

    return GeolocationService;
}

angular.module('spacebox').factory('GeolocationService',
    ['$http', '$log', '$q', 'ConfigService', 'ErrorHandler', GeolocationService]);
