function UserService ($q, $log, $cookieStore, VkService) {

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
        var deferred = $q.defer();
        VkService.asyncGetUsersInfo(id).then(function (response) {
            if (angular.isArray(response) && response.length > 0) {
                var user = response[0];
                user.age = computeAge(response[0].bdate);
                UserService._user = user;
                deferred.resolve(user);
            }
            else {
                deferred.reject();
            }
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    UserService.getInfo = function () {
        return UserService._user;
    };

    return UserService;
}

angular.module('spacebox').factory('UserService',
    ['$q', '$log', '$cookieStore', 'VkService', UserService]);
