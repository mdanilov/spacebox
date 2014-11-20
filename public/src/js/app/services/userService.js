function UserService ($q, $log, $filter, VkService) {

    var UserService = {};
    UserService._user = {};
    UserService._status = '';

    UserService.asyncUpdateInfo = function (id) {
        return VkService.asyncGetUsersInfo(id).then(function (info) {
            var user = info[0];
            user.age = $filter('age')(info[0].bdate);

            $log.debug('Current user info ', user);
            UserService._user = user;

            return user;
        });
    };

    UserService.getInfo = function () {
        return UserService._user;
    };

    UserService.setStatus = function (status) {
        if (!angular.isString(status)) {
            return;
        }
        UserService._status = status;
    };

    UserService.getStatus = function () {
        return UserService._status;
    };

    return UserService;
}

angular.module('spacebox').factory('UserService',
    ['$q', '$log', '$filter', 'VkService', UserService]);
