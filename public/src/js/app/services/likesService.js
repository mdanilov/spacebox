function LikesService ($q, $log, $http, ConfigService) {

    var LikesService = {};
    var LIKE_STATES = {
        LIKE: 1,
        DISLIKE: -1
    };

    function asyncChangeLikeStatus (id, status) {
        return $http.get(ConfigService.SERVER_URL + '/changeLikeStatus', {
            params: {id: id, status: status}
        }).catch(function (response) {
            return $q.reject(new HttpError(response.status, 'change like status request failed'));
        });
    }

    LikesService.asyncLike = function (id) {
        return asyncChangeLikeStatus(id, LIKE_STATES.LIKE);
    };

    LikesService.asyncDislike = function (id) {
        return asyncChangeLikeStatus(id, LIKE_STATES.DISLIKE);
    };

    return LikesService;
}

angular.module('spacebox').factory('LikesService',
    ['$q', '$log', '$http', 'ConfigService', LikesService]);
