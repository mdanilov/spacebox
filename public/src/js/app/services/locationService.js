function LocationService ($http, $log, $q, $cookieStore, ConfigService) {

    var LocationService = {};

    LocationService.asyncGetCurrentPosition = function () {
        var deferred = $q.defer();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                $cookieStore.put('location', position);
                deferred.resolve(position);
            }, function () {
                deferred.reject(new LocationError(true));
            });
        }
        else {
            deferred.reject(new LocationError(false));
        }
        return deferred.promise;
    };

    LocationService.asyncGetUserPositions = function (options) {
        return LocationService.asyncGetCurrentPosition().then(function (position) {
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

    return LocationService;
}

angular.module('spacebox').factory('LocationService',
    ['$http', '$log', '$q', '$cookieStore', 'ConfigService', LocationService]);
