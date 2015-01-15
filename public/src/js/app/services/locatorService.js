function LocatorService ($http, $log, $q, VkService, LocationService, ConfigService) {

    var LocatorService = {};

    LocatorService._users = [];
    LocatorService._current = -1;

    LocatorService.LOAD_ERROR_PHOTO = 'https://vk.com/images/camera_400.gif';

    function asyncLoadImages (user) {
        return VkService.asyncGetPhotos(user.mid).then(function __success (images) {
            images.forEach(function __loadImage (image) {
                $(new Image()).prop('src', image);
            });
            user.photos = images;
        }, function __error (error) {
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

        return VkService.asyncGetUsersInfo(uids).then(function (info) {
            $log.debug('VK users info ', info);
            users.forEach(function __addInfo (user, i) {
                user.info = info[i];
            });
            LocatorService._users = users;
            LocatorService._current = -1;
            return asyncLoadImages(users[0]).then(function () {
                return users.length;
            });
        });
    }

    function asyncGetUserPositions (options) {
        return LocationService.getCurrentPosition().then(function (position) {
            var params = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                options: options
            };
            return $http.post(ConfigService.SERVER_URL + '/users.get', params).then(
                function __success(response) {
                    $log.debug('Get near users ', response.data);
                    return response.data;
                },
                function __error(response) {
                    return $q.reject(new HttpError(response.status, 'get users request failed'));
                });
        });
    }

    LocatorService.asyncSearch = function () {
        var options = ConfigService.getSearchOptions();
        $log.debug('Search options ', options);
        return asyncGetUserPositions(options).then(function (users) {
            if (angular.isArray(users) && users.length > 0) {
                $log.debug('Near users ', users);
                return asyncInvalidateUsers(users);
            }
        });
    };

    LocatorService.getPreviousUser = function () {
        var current = LocatorService._current;
        var users = LocatorService._users;

        if (!angular.isArray(users) || users.length == 0) {
            return;
        }

        if (current < 1) {
            $log.debug('No previous user');
        }
        else {
            current -= 1;
        }

        LocatorService._current = current;
        return users[current];
    };

    LocatorService.getNextUser = function () {
        var current = LocatorService._current;
        var users = LocatorService._users;

        if (!angular.isArray(users) || users.length == 0) {
            return;
        }

        if (current >= users.length - 1) {
            $log.debug('No next user');
            return;
        }

        current += 1;

        var next = current + 1;
        if (next < users.length && !users[next].photos) {
            asyncLoadImages(users[next]);
        }

        LocatorService._current = current;
        return users[current];
    };

    return LocatorService;
}

angular.module('spacebox').factory('LocatorService',
    ['$http', '$log', '$q', 'VkService', 'LocationService', 'ConfigService', LocatorService]);
