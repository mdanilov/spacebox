function FriendsService ($resource, $window, $log, $rootScope, $interval, localStorageService, VkService, ConfigService) {

    var FriendsService = {};

    var _resource = $resource(ConfigService.SERVER_URL + '/friends.get', null, {
        'query':  {
            method: 'GET',
            isArray: true,
            transformResponse: transformResponse
        }
    });
    var _interval = undefined;
    var _friends = localStorageService.get('friends') || _resource.query();

    function transformResponse (data) {
        var friends = angular.fromJson(data);
        var hasNewFriends = false;

        friends.forEach(function (item) {
            if (item.timestamp) {
                item.location = {
                    latitude: item.latitude,
                    longitude: item.longitude,
                    timestamp: item.timestamp
                };
            }

            delete item.latitude;
            delete item.longitude;
            delete item.timestamp;

            for(var i = 0; i < _friends.length; ++i) {
                if (_friends[i].mid == item.mid) {
                    break;
                }
            }
            if ((i == _friends.length) || (_friends[i].new == true)) {
                item.new = true;
                hasNewFriends = true;
            }
        });

        if (hasNewFriends) {
            $rootScope.$broadcast('friends.new');
        }

        return friends;
    }

    angular.element($window).on('beforeunload', function () {
        $log.debug('[friends] Save friends to local storage', _friends);
        localStorageService.set('friends', _friends);
    });

    FriendsService.addFriend = function (user) {
        var i = 0;
        while (i < _friends.length) {
            if (_friends[i].mid == user.mid) {
                break;
            }
            ++i;
        }
        if (i == _friends.length) {
            _friends.push(user);
        }
    };

    function updateFriends (callback) {
        _resource.query().$promise.then(function (friends) {
            var uids = friends.map(function (friend) {
                return friend.mid;
            });
            return VkService.asyncGetUsersInfo(uids).then(function (info) {
                friends.forEach(function (friend, i) {
                    friend.info = info[i];
                });
                angular.copy(friends, _friends);
                _friends.$resolved = true;
                if (angular.isFunction(callback)) {
                    callback(_friends);
                }
            });
        });
    }

    FriendsService.getFriends = function (callback) {
        updateFriends(callback);
        if (angular.isUndefined(_interval)) {
            _interval = $interval(updateFriends, ConfigService.FRIENDS_UPDATE_INTERVAL_SEC * 1000);
        }
        return _friends;
    };

    return FriendsService;
}

angular.module('spacebox').factory('FriendsService',
    ['$resource', '$window', '$log', '$rootScope', '$interval', 'localStorageService', 'VkService', 'ConfigService', FriendsService]);
