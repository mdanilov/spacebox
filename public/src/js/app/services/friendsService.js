function FriendsService ($http, $log, $rootScope, $interval, $q, localStorageService, VkService, ConfigService) {
    var FriendsService = {};
    var _friends = localStorageService.get('friends');

    $interval(asyncGetFriends, ConfigService.FRIENDS_UPDATE_INTERVAL_SEC * 1000);

    function asyncGetFriends () {
        return $http.get(ConfigService.SERVER_URL + '/friends.get').then(function (response) {
            if (!angular.isArray(response.data)) {
                throw new Error();
            }

            function asyncGetInfo (friends) {
                var uids = friends.map(function (friend) {
                    return friend.mid;
                });
                return VkService.asyncGetUsersInfo(uids).then(function (info) {
                    friends.forEach(function __addInfo(friend, i) {
                        friend.info = info[i];
                    });
                    _friends = _friends.concat(friends);
                    return _friends;
                });
            }

            if (!angular.isArray(_friends)) {
                _friends = [];
            }

            if (response.data.length > 0) {
                var friends = response.data;
                if (_friends.length > 0) {
                    friends = friends.reduce(function (newFriends, friend) {
                        var exist = _friends.some(function (element) {
                            return element.mid == friend.mid;
                        });

                        if (!exist) {
                            newFriends.push(friend);
                        }
                        return newFriends;
                    }, []);
                }
                if (friends.length > 0) {
                    var hasNew = true;
                    $rootScope.$broadcast('friends.new');
                }
            }

            return $q.when(hasNew ? asyncGetInfo(friends) : _friends).then(function () {
                localStorageService.set('friends', _friends);
            });
        }, function (response) {
            throw new HttpError(response.status, 'friends.get request failed');
        });
    }

    FriendsService.getFriend = function (id) {
        for (var i = 0; i < _friends.length; ++i) {
            if (_friends[i].mid == id) {
                return _friends[i];
            }
        }
    };

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

    FriendsService.asyncGetFriends = function () {
        return $q.when(_friends ? _friends : asyncGetFriends());
    };

    return FriendsService;
}

angular.module('spacebox').factory('FriendsService',
    ['$http', '$log', '$rootScope', '$interval', '$q', 'localStorageService', 'VkService', 'ConfigService', FriendsService]);
