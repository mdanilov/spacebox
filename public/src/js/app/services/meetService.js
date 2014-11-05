function MeetService ($http, $log, $q, VkService) {

    var MeetService = {};

    MeetService.asyncLike = function (userId) {
        var deferred = $q.defer();
        $http.get(config.serverUrl + '/changeLikeStatus', {params: {id: userId, status: 1}}).
            success(function (data, status, headers, config) {
                deferred.resolve();
            }).
            error(function (data, status, headers, config) {
                deferred.reject(status);
            });
        return deferred.promise;
    };

    MeetService.asyncDislike = function (userId) {
        var deferred = $q.defer();
        $http.get(config.serverUrl + '/changeLikeStatus', {params: {id: userId, status: -1}}).
            success(function (data, status, headers, config) {
                deferred.resolve();
            }).
            error(function (data, status, headers, config) {
                deferred.reject(status);
            });
        return deferred.promise;
    };

    MeetService.asyncGetFriends = function () {
        var deferred = $q.defer();
        $http.get(config.serverUrl + '/getFriends').
            success(function (data, status, headers, config) {
                var friends = data;
                var uids = [];
                for (var i = 0; i < data.length; i++) {
                    uids.push(data[i].mid);
                }
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
                deferred.reject(status);
            });
        return deferred.promise;
    };

    return MeetService;
}

angular.module('spacebox').factory('MeetService',
    ['$http', '$log', '$q', 'VkService', MeetService]);

