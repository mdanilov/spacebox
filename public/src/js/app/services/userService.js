function UserService ($q, $log, $filter, VkService) {

    var UserService = {};
    UserService._user = {};

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

    return UserService;
}

angular.module('spacebox').factory('UserService',
    ['$q', '$log', '$filter', 'VkService', UserService]);
