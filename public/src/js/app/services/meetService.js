function MeetService ($http, $log, $q, VkService, ConfigService) {

    var MeetService = {};
    MeetService._friends = [];
    MeetService.LIKE_STATES = {
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

    MeetService.asyncLike = function (id) {
        return asyncChangeLikeStatus(id, MeetService.LIKE_STATES.LIKE);
    };

    MeetService.asyncDislike = function (id) {
        return asyncChangeLikeStatus(id, MeetService.LIKE_STATES.DISLIKE);
    };

    MeetService.asyncGetFriends = function () {
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
                        MeetService._friends = friends;
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

    return MeetService;
}

angular.module('spacebox').factory('MeetService',
    ['$http', '$log', '$q', 'VkService', 'ConfigService', MeetService]);

