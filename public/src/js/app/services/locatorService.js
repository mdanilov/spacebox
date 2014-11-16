function LocatorService ($http, $log, $q, VkService, GeolocationService, ConfigService) {

    var LocatorService = {};

    LocatorService._users = [];
    LocatorService._currentId = 0;

    function preloadImages (images) {
        images.forEach(function __loadImage (image) {
            $(new Image()).prop('src', image);
        });
    }

    function asyncInvalidateUsers (users) {
        users = users.filter(function __isNewUser (user) {
            return user.like == 0;
        });
        var uids = users.map(function __map (user) {
            return user.mid;
        });

        return VkService.asyncGetUsersInfo(uids).then(function __success (info) {
            $log.debug('VK users info ', info);
            users.forEach(function __addInfo (user, i) {
                user.info = info[i];
            });
            LocatorService._users = users;
            LocatorService._currentId = 0;
            return VkService.asyncGetPhotos(users[0].mid).then(function (images) {
                preloadImages(images);
                users[0].photos = images;
            });
        });
    }

    LocatorService.asyncSearch = function () {
        $log.debug('Search near users...');
        var options = ConfigService.getSearchOptions();
        return GeolocationService.asyncGetUserPositions(options).then(function __success (users) {
            if (angular.isArray(users) && users.length > 0) {
                $log.debug('Near users ', users);
                return asyncInvalidateUsers(users);
            }
        });
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


