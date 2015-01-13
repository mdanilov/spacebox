function StatusService ($q, $log, $http, ConfigService) {

    var StatusService = {};

    var _status = { text: '', resolved: false };

    function asyncGetStatus (user_id) {
        return $http.post(ConfigService.SERVER_URL + '/status.get', {user_id: user_id}).then(function (response) {
            _status = {
                text: response.data.text,
                resolved: true
            };
            return _status;
        }, function (error) {
            return $q.reject(new HttpError(error, 'status.get request failed'));
        });
    }

    StatusService.set = function (text) {
        if (!angular.isString(text)) {
            return;
        }

        _status.text = text;
        _status.resolved = false;
        $http.post(ConfigService.SERVER_URL + '/status.set', {text: text}).then(function () {
            _status.resolved = true;
        }, function (response) {
            throw new HttpError(response.status, 'status.set request failed');
        });
    };

    StatusService.get = function () {
        return $q.when(_status.resolved ? _status : asyncGetStatus());
    };

    return StatusService;
}

angular.module('spacebox').factory('StatusService',
    ['$q', '$log', '$http', 'ConfigService', StatusService]);
