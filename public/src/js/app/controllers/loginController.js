function LoginViewController ($scope, $log, $location, VkService, UserService, ConfigService, ErrorHandler) {
    $log.debug('Initialize login view controller...');

    $scope.app.isNavbarHidden = true;

    $scope.images = [
        "src/img/login-1.jpg",
        "src/img/login-2.jpg",
        "src/img/login-3.jpg",
        "src/img/login-4.jpg"
    ];

    $scope.Login = function () {
        $log.debug('Try login to VK...');
        VkService.asyncLogin().then(function (id) {
            UserService.asyncUpdateInfo(id).then(function (info) {
                ConfigService.init(info);
                $location.path('/');
            }, ErrorHandler.handle);
        });
    }
}

angular.module('spacebox').controller('LoginViewController',
    ['$scope', '$log', '$location', 'VkService', 'UserService', 'ConfigService', 'ErrorHandler', LoginViewController]);