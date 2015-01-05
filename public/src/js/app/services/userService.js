function UserService ($q, $log, $filter, VkService) {

    var UserService = {};
    var _user = {};

    UserService.asyncUpdateInfo = function (id) {
        return VkService.asyncGetUsersInfo(id).then(function (info) {
            var user = info[0];
            user.age = $filter('age')(info[0].bdate);

            $log.debug('Current user info ', user);
            _user = user;

            return user;
        });
    };

    UserService.getInfo = function () {
        return _user;
    };

    UserService.asyncGetPhotos = function () {
        return VkService.asyncGetPhotos(_user.id).then(function (images) {
            angular.forEach(images, function (image) {
                angular.element(new Image()).prop('src', image);
            });
            return images;
        });
    };

    return UserService;
}

angular.module('spacebox').factory('UserService',
    ['$q', '$log', '$filter', 'VkService', UserService]);
