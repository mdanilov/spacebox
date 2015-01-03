function FriendsService ($resource, $window, $log, $rootScope, $interval, localStorageService, VkService, ConfigService) {

    var FriendsService = {};

    var _friends = [];
    var _resource = $resource(ConfigService.SERVER_URL + '/friends.get', null, {
        'query':  {
            method: 'GET',
            isArray: true,
            transformResponse: transformResponse
        }
    });

    var storedData = localStorageService.get('friends');
    _friends.resolved = angular.isArray(storedData);
    if (_friends.resolved) {
        _friends = storedData;
    }

    function getFriendIds (friends) {
        return friends.map(function (friend) {
            return friend.mid;
        });
    }

    function transformResponse (data) {
        data = angular.fromJson(data);

        var ids = getFriendIds(_friends);
        var hasNewFriends = false;
        data.forEach(function (item) {
            var pos = ids.indexOf(item.mid);
            if (pos == -1 || (_friends[pos].new == true)) {
                item.new = true;
                hasNewFriends = true;
            }
        });

        if (hasNewFriends) {
            $rootScope.$broadcast('friends.new');
        }

        return data;
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

    function queryResources (callback) {
        _resource.query().$promise.then(function (friends) {
            var ids = getFriendIds(friends);
            return VkService.asyncGetUsersInfo(ids).then(function (info) {
                friends.forEach(function (friend, i) {
                    friend.info = info[i];
                });
                angular.copy(friends, _friends);
                _friends.resolved = true;
                if (angular.isFunction(callback)) {
                    callback(_friends);
                }
            });
        });
    }

    FriendsService.getFriends = function (callback) {
        queryResources(callback);
        if (angular.isUndefined(_friends.interval)) {
            _friends.interval = $interval(queryResources,
                ConfigService.FRIENDS_UPDATE_INTERVAL_SEC * 1000);
        }
        return _friends;
    };

    return FriendsService;
}

angular.module('spacebox').factory('FriendsService',
    ['$resource', '$window', '$log', '$rootScope', '$interval', 'localStorageService', 'VkService', 'ConfigService', FriendsService]);
