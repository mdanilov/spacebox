function LocatorService ($log, $q, VkService, GeolocationService, ConfigService) {

    var LocatorService = {};

    LocatorService._users = [];
    LocatorService._currentId = 0;

    LocatorService.LOAD_ERROR_PHOTO = 'https://vk.com/images/camera_400.gif';

    function asyncLoadImages (user) {
        return VkService.asyncGetPhotos(user.mid).then(function __success (images) {
            images.forEach(function __loadImage (image) {
                $(new Image()).prop('src', image);
            });
            user.photos = images;
        }, function (error) {
            $log.error('VK get photos error ', error);
            user.photos = [ LocatorService.LOAD_ERROR_PHOTO ];
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
            return asyncLoadImages(users[0]);
        });
    }

    LocatorService.asyncSearch = function () {
        var options = ConfigService.getSearchOptions();
        $log.debug('Search options ', options);
        return GeolocationService.asyncGetUserPositions(options).then(function __success (users) {
            if (angular.isArray(users) && users.length > 0) {
                $log.debug('Near users ', users);
                return asyncInvalidateUsers(users);
            }
        });
    };

    LocatorService.prevUser = function () {
        if (LocatorService._users.length === 0) {
            return;
        }

        if (angular.equals(LocatorService._currentId, 0)) {
            $log.debug('No previous user');
        }
        else {
            LocatorService._currentId -= 1;
        }

        return LocatorService._users[LocatorService._currentId];
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
            asyncLoadImages(users[nextId]);
        }

        LocatorService._currentId = nextId;

        return users[currentId];
    };

    return LocatorService;
}

angular.module('spacebox').factory('LocatorService',
    ['$log', '$q', 'VkService', 'GeolocationService', 'ConfigService', LocatorService]);
