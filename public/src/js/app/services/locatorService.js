function LocatorService ($http, $log, $q, VkService, GeolocationService, ConfigService) {

    var LocatorService = {};
    LocatorService._users = [];

    function invalidateUsers (data) {
        var deferred = this;

        function resolve (data) {
            LocatorService._users = data;
            deferred.resolve(data);
        }

        if (!data.length) {
            resolve();
        }

        var uids = [];
        for (var i = 0; i < data.length; i++) {
            uids.push(data[i].mid);
        }

        VkService.asyncGetUsersInfo(uids).then(function (info) {
            $log.debug('VK users info collected: ', info);
            for (var i = 0; i < info.length; i++) {
                data[i].info = info[i];
            }
            resolve(data);
        }, function (error) {
            $log.error('Can\'t get VK users info due to error: ', error);
            deferred.reject(error);
        });
    }

    LocatorService.asyncSearch = function () {
        var deferred = $q.defer();
        $log.debug('Search near users...');
        GeolocationService.asyncGetUserPositions(ConfigService.searchRadius).then(function (data) {
            $log.debug('Founded near users locations: ', data);
            invalidateUsers.bind(deferred)(data);
        }, function (error) {
            $log.error('Can\'t get near users due to error: ', error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    LocatorService.getFirstNewUser = function () {
        var users = LocatorService._users;
        var first = null;
        for (var i = 0; i < users.length; i++) {
            if (users[i].like == 0) {
                first = users[i];
                break;
            }
        }
        return first;
    };

    return LocatorService;
}

angular.module('spacebox')
    .factory('LocatorService', ['$http', '$log', '$q', 'VkService', 'GeolocationService', 'ConfigService', LocatorService]);


