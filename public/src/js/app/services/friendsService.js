function FriendsService ($http, $log, $rootScope, $interval, $q, VkService, ConfigService) {

    var FriendsService = {};
    FriendsService._friends = [];

    function updateFriends () {
        $http.get(ConfigService.SERVER_URL + '/friends.get').then(function (response) {
            var friends = response.data;
            if (angular.isArray(friends) && friends.length > 0) {
                friends = friends.reduce(function (newFriends, friend) {
                    var exist = FriendsService._friends.some(function (element) {
                        return element.mid == friend.mid;
                    });
                    if (!exist) {
                        newFriends.push(friend);
                    }
                    return newFriends;
                }, []);

                if (friends.length > 0) {
                    var uids = friends.map(function (friend) {
                        return friend.mid;
                    });
                    VkService.asyncGetUsersInfo(uids).then(function (info) {
                        friends.forEach(function __addInfo(friend, i) {
                            friend.info = info[i];
                        });
                        FriendsService._friends.concat(friends);
                        $rootScope.$broadcast('friends.new');
                    });
                }
            }
        }, function (response) {
            throw new HttpError(response.status, 'friends.get request failed');
        });
    }

    $interval(updateFriends, ConfigService.FRIENDS_UPDATE_INTERVAL_SEC * 1000);

    FriendsService.getFriend = function (user_id) {
        for (var i = 0; i < FriendsService._friends.length; i++) {
            if (user_id == FriendsService._friends[i].mid) {
                return FriendsService._friends[i];
            }
        }
    };

    FriendsService.asyncGetFriends = function () {
        return $http.get(ConfigService.SERVER_URL + '/friends.get').then(
            function __success (response) {
                var friends = response.data;
                if (angular.isArray(friends) && friends.length > 0) {
                    var uids = friends.map(function (friend) {
                        return friend.mid;
                    });

                    return VkService.asyncGetUsersInfo(uids).then(function (info) {
                        friends.forEach(function __addInfo(friend, i) {
                            friend.info = info[i];
                        });
                        FriendsService._friends = friends;

                        return friends;
                    });
                }
                else {
                    return [];
                }
            },
            function __error (response) {
                return $q.reject(new HttpError(response.status, 'get friends request failed'));
            });
    };

    return FriendsService;
}

angular.module('spacebox').factory('FriendsService',
    ['$http', '$log', '$rootScope', '$interval', '$q', 'VkService', 'ConfigService', FriendsService]);

