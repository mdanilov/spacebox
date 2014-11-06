function LoginViewController ($scope, $log, $location, VkService, ConfigService) {
    $log.debug('Initialize login view controller...');

    $scope.app.isNavbarHidden = true;

    $scope.Login = function () {
        $log.debug('Try login to VK...');
        VkService.asyncLogin().then(function () {
            ConfigService.isLogin = true;
            $location.path('/');
        });
    }
}

angular.module('spacebox').controller('LoginViewController',
    ['$scope', '$log', '$location', 'VkService', 'ConfigService', LoginViewController]);