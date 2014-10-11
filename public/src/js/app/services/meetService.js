function MeetService ($http, $log) {

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

    MeetService.getFriends = function (callback) {
        $http.get(config.serverUrl + '/getFriends').
            success(function (data, status, headers, config) {
                callback(null, data);
            }).
            error(function (data, status, headers, config) {
                callback(status);
            });
    };

    return MeetService;
}

angular.module('spacebox')
    .factory('MeetService', ['$http', '$log', MeetService]);

