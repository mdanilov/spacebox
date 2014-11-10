function LocatorService ($http, $log, $q, VkService, GeolocationService, ConfigService) {

    var LocatorService = {};

    LocatorService._users = [];
    LocatorService._currentId = 0;

    function filterNewUsers (users) {
        var newUsers = [];
        for (var i = 0; i < users.length; i++) {
            if (users[i].like == 0) {
                newUsers.push(users[i]);
            }
        }
        return newUsers;
    }

    function preloadImages (images) {
        for (var i = 0; i < images.length; i++) {
            $(new Image()).prop('src', images[i]);
        }
    }

    function invalidateUsers (data) {
        var deferred = this;

        if (!data.length) {
            deferred.resolve();
        }

        data = filterNewUsers(data);

        var uids = [];
        for (var i = 0; i < data.length; i++) {
            uids.push(data[i].mid);
        }

        VkService.asyncGetUsersInfo(uids).then(function (info) {
            $log.debug('VK users info collected: ', info);
            for (var i = 0; i < info.length; i++) {
                data[i].info = info[i];
            }
            LocatorService._users = data;
            LocatorService._currentId = 0;
            var user = data[0];
            VkService.asyncGetPhotos(user.mid).then(function (images) {
                user.photos = images;
            });
            deferred.resolve(data);
        }, function (error) {
            $log.error('Can\'t get VK users info due to error: ', error);
            deferred.reject(error);
        });
    }

    LocatorService.asyncSearch = function () {
        var deferred = $q.defer();
        $log.debug('Search near users...');
        GeolocationService.asyncGetUserPositions(ConfigService.searchOptions).then(function (data) {
            $log.debug('Founded near users locations: ', data);
            invalidateUsers.bind(deferred)(data);
        }, function (error) {
            $log.error('Can\'t get near users due to error: ', error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    LocatorService.nextUser = function () {
        var currentId = LocatorService._currentId;
        var users = LocatorService._users;

        if (users.length == 0 ||
            currentId == users.length) {
            $log.debug('No new users to return');
            return;
        }

        var nextId = currentId + 1;
        if (nextId < users.length && !users[nextId].photos) {
            VkService.asyncGetPhotos(users[nextId].mid).then(function (images) {
                preloadImages(images);
                users[nextId].photos = images;
            });
        }

        LocatorService._currentId = nextId;

        return users[currentId];
    };

    return LocatorService;
}

angular.module('spacebox').factory('LocatorService',
    ['$http', '$log', '$q', 'VkService', 'GeolocationService', 'ConfigService', LocatorService]);


