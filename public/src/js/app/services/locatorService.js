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
        var uids = data.map(function (user) { return user.mid; });

        VkService.asyncGetUsersInfo(uids).then(function (info) {
            $log.debug('VK users info collected: ', info);
            for (var i = 0; i < info.length; i++) {
                data[i].info = info[i];
            }
            LocatorService._users = data;
            LocatorService._currentId = 0;
            VkService.asyncGetPhotos(data[0].mid).then(function (images) {
                preloadImages(images);
                data[0].photos = images;
                deferred.resolve(data);
            }, function (error) {
                $log.error('VK get photos error ', error);
                deferred.resolve([]);
            });
        }, function (error) {
            deferred.reject(error);
        });
    }

    LocatorService.asyncSearch = function () {
        var deferred = $q.defer();
        $log.debug('Search near users...');
        var options = ConfigService.getSearchOptions();
        GeolocationService.asyncGetUserPositions(options).then(function (data) {
            $log.debug('Founded near users locations: ', data);
            invalidateUsers.bind(deferred)(data);
        }, function (error) {
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
            }, function (error) {
                $log.error('VK get photos error ', error);
            });
        }

        LocatorService._currentId = nextId;

        return users[currentId];
    };

    return LocatorService;
}

angular.module('spacebox').factory('LocatorService',
    ['$http', '$log', '$q', 'VkService', 'GeolocationService', 'ConfigService', LocatorService]);


