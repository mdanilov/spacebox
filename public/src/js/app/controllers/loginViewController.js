function LoginViewController ($scope, $log, $location, VkService, UserService, ConfigService, ErrorHandler) {
    $log.debug('Initialize login view controller...');

    $scope.app.isNavbarHidden = true;

    $scope.Login = function () {
        $log.debug('Try login to VK...');
        VkService.asyncLogin().then(function (id) {
            UserService.asyncUpdateInfo(id).then(function (info) {
                ConfigService.update(info);
                $location.path('/');
            }, ErrorHandler.handle);
        });
    }
}

angular.module('spacebox').controller('LoginViewController',
    ['$scope', '$log', '$location', 'VkService', 'UserService', 'ConfigService', 'ErrorHandler', LoginViewController]);