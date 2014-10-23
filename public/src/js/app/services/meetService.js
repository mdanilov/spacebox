function MeetService ($http, $log, $q, VkService) {

    var MeetService = {};

    MeetService.like = function (userId, callback) {
        $http.get(config.serverUrl + '/changeLikeStatus', {params: {id: userId, status: 1}}).
            success(function (data, status, headers, config) {
                callback(null);
            }).
            error(function (data, status, headers, config) {
                callback(status);
            });
    };

    MeetService.dislike = function (userId, callback) {
        $http.get(config.serverUrl + '/changeLikeStatus', {params: {id: userId, status: -1}}).
            success(function (data, status, headers, config) {
                callback(null);
            }).
            error(function (data, status, headers, config) {
                callback(status);
            });
    };

    MeetService.asyncGetFriends = function () {
        var deferred = $q.defer();
        $http.get(config.serverUrl + '/getFriends').
            success(function (data, status, headers, config) {
                VkService.asyncGetUsersInfo(data).then(function (info) {
                    deferred.resolve(info);
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

angular.module('spacebox')
    .factory('MeetService', ['$http', '$log', '$q', 'VkService', MeetService]);

