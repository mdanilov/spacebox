function StatusService ($q, $log, $http, ErrorHandler, ConfigService) {

    var StatusService = {};
    StatusService._status = '';

    function asyncGetStatus (user_ids) {
        if (angular.isDefined(user_ids) && !angular.isArray(user_ids)) {
            return $q.reject(new Error(500, 'user_ids not array'));
        }

        return $http.get(ConfigService.SERVER_URL + '/status.get', {
            params: {user_ids: user_ids}
        }).then(function (response) {
            return response.data;
        }, function (error) {
            return $q.reject(new HttpError(error, 'status.get request failed'));
        });
    }

    StatusService.set = function (text) {
        if (!angular.isString(text)) {
            return;
        }

        StatusService._status = text;
        $http.get(ConfigService.SERVER_URL + '/status.set', {
            params: {text: text}
        }).error (function (data, status, headers, config) {
            ErrorHandler.handle(new HttpError(response.status, 'status.set request failed'));
        });
    };

    StatusService.get = function (user_ids) {
        return $q.when(user_ids ? asyncGetStatus(user_ids) : StatusService._status).then(function (response) {
            return response;
        });
    };

    StatusService.promise = asyncGetStatus().then(function (status) {
        if (angular.isArray(status) &&
            (status.length > 0) &&
            angular.isString(status[0].text)) {
            StatusService._status = status[0].text;
            return StatusService._status;
        }
    });

    return StatusService;
}

angular.module('spacebox').factory('StatusService',
    ['$q', '$log', '$http', 'ErrorHandler', 'ConfigService', StatusService]);
