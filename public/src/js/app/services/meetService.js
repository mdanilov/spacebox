function MeetService ($http, $log, $q, VkService, ConfigService) {

    var MeetService = {};

    MeetService.asyncLike = function (userId) {
        var deferred = $q.defer();
        $http.get(ConfigService.SERVER_URL + '/changeLikeStatus', {params: {id: userId, status: 1}}).
            success(function (data, status, headers, config) {
                deferred.resolve();
            }).
            error(function (data, status, headers, config) {
                deferred.reject(new HttpError(status, 'like request failed'));
            });
        return deferred.promise;
    };

    MeetService.asyncDislike = function (userId) {
        var deferred = $q.defer();
        $http.get(ConfigService.SERVER_URL + '/changeLikeStatus', {params: {id: userId, status: -1}}).
            success(function (data, status, headers, config) {
                deferred.resolve();
            }).
            error(function (data, status, headers, config) {
                deferred.reject(new HttpError(status, 'dislike request failed'));
            });
        return deferred.promise;
    };

    MeetService.asyncGetFriends = function () {
        var deferred = $q.defer();
        $http.get(ConfigService.SERVER_URL + '/getFriends').
            success(function (data, status, headers, config) {
                var friends = data;
                var uids = data.map(function (user) { return user.mid; });
                VkService.asyncGetUsersInfo(uids).then(function (info) {
                    for (var i = 0; i < info.length; i++) {
                        friends[i].info = info[i];
                    }
                    deferred.resolve(friends);
                }, function (error) {
                    deferred.reject(error);
                })
            }).
            error(function (data, status, headers, config) {
                deferred.reject(new HttpError(status, 'get friends request failed'));
            });
        return deferred.promise;
    };

    return MeetService;
}

angular.module('spacebox').factory('MeetService',
    ['$http', '$log', '$q', 'VkService', 'ConfigService', MeetService]);

