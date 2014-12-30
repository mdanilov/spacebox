function FriendsService ($http, $log, $rootScope, $interval, $q, localStorageService, VkService, ConfigService) {
    var FriendsService = {};
    var _friends = localStorageService.get('friends');

    $interval(asyncUpdateFriends, ConfigService.FRIENDS_UPDATE_INTERVAL_SEC * 1000);

    function asyncUpdateFriends () {
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
                    _friends.concat(friends);
                    return _friends;
                });
            }

            var hasNew = false;
            if (response.data.length > 0) {
                var friends = response.data;
                friends = friends.reduce(function (newFriends, friend) {
                    var exist = _friends.some(function (element) {
                        return element.mid == friend.mid;
                    });
                    if (!exist) {
                        newFriends.push(friend);
                    }
                    return newFriends;
                }, []);
                if (friends.length > 0) {
                    hasNew = true;
                    $rootScope.$broadcast('friends.new');
                }
            }
            else {
                _friends = [];
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

    FriendsService.asyncGetFriends = function () {
        return $q.when(_friends ? _friends : asyncUpdateFriends());
    };

    return FriendsService;
}

angular.module('spacebox').factory('FriendsService',
    ['$http', '$log', '$rootScope', '$interval', '$q', 'localStorageService', 'VkService', 'ConfigService', FriendsService]);
