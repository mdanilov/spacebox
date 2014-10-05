function MeetService ($http, $log) {

    var MeetService = {};

    MeetService.like = function (userId, callback) {
        $http.get(config.serverUrl + '/like', {params: {id: userId}}).
            success(function (data, status, headers, config) {
                callback(null);
            }).
            error(function (data, status, headers, config) {
                callback(status);
            });
    };

    MeetService.dislike = function (userId, callback) {
        $http.get(config.serverUrl + '/dislike', {params: {id: userId}}).
            success(function (data, status, headers, config) {
                callback(null);
            }).
            error(function (data, status, headers, config) {
                callback(status);
            });
    };

    return MeetService;
}

angular.module('spacebox')
    .factory('MeetService', ['$http', '$log', MeetService]);

