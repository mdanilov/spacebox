function UserService ($q, $log, VkService) {

    var UserService = {};
    UserService._user = {};

    function computeAge (vkDate) {
        var age = -1;
        if (vkDate.length > 6) {
            var date = vkDate.split('.');
            date = [date[1], date[0], date[2]].join('.');
            var bdate = new Date(date);
            var today = new Date();
            age = today.getYear() - bdate.getYear();
        }
        return age;
    }

    UserService.asyncUpdateInfo = function (id) {
        return VkService.asyncGetUsersInfo(id).then(function (info) {
            var user = info[0];
            user.age = computeAge(info[0].bdate);
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
    ['$q', '$log', 'VkService', UserService]);
