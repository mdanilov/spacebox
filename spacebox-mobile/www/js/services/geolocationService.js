﻿function GeolocationService ($http, $log) {

    var GeolocationService = {};

    function handleNoGeolocation (errorFlag) {
        if (errorFlag) {
            $log.error('Geolocation is off');
        } else {
            $log.error('Browser doesn\'t support geolocation');
        }
    }

    GeolocationService.getCurrentPosition = function (callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(callback, function () {
                handleNoGeolocation(true);
            });
        }
        else {
            handleNoGeolocation(false);
        }
    };

    GeolocationService.getNearUsers = function (radius, callback) {
        GeolocationService.getCurrentPosition(function (position) {
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

angular.module('spacebox-mobile')
    .factory('GeolocationService', ['$http', '$log', GeolocationService]);
