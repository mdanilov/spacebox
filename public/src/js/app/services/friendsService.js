function FriendsService ($http, $log, $q, VkService, ConfigService) {

    var FriendsService = {};
    FriendsService._friends = [];
    FriendsService.LIKE_STATES = {
        LIKE: 1,
        DISLIKE: -1
    };

    function asyncChangeLikeStatus (id, status) {
        return $http.get(ConfigService.SERVER_URL + '/changeLikeStatus', {
            params: {id: id, status: status}
        }).catch(
            function (response) {
                return $q.reject(new HttpError(response.status, 'change like status request failed'));
            });
    }

    FriendsService.asyncLike = function (id) {
        return asyncChangeLikeStatus(id, FriendsService.LIKE_STATES.LIKE);
    };

    FriendsService.asyncDislike = function (id) {
        return asyncChangeLikeStatus(id, FriendsService.LIKE_STATES.DISLIKE);
    };

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
                    })
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
    ['$http', '$log', '$q', 'VkService', 'ConfigService', FriendsService]);

