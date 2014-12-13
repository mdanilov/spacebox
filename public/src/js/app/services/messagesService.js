function MessagesService ($q, $http, ConfigService) {

    var MessagesService = {};

    MessagesService.asyncGetHistory = function (user_id) {
        return $http.post(ConfigService.SERVER_URL + '/messages.getHistory',
            {user_id: user_id}
        ).then(function (response) {
            return response.data.items;
        },
        function (response) {
            return $q.reject(new HttpError(response.status, 'messages.getHistory request failed'));
        });
    };

    return MessagesService;
}

angular.module('spacebox').factory('MessagesService',
    ['$q', '$http', 'ConfigService', MessagesService]);
