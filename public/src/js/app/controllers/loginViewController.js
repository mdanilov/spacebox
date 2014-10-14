function LoginViewController ($scope, $log, $location, VkService, ConfigService) {

    $log.debug('Initialize login page controller...');

    $scope.Login = function (e) {
        e.preventDefault();
        $log.debug('Try login to VK...');
        VkService.login(function (error) {
            if (!error) {
                ConfigService.isAuthorized = true;
                $location.path('/');
            }
        });
    }
}

angular.module('spacebox')
    .controller('LoginViewController',
        ['$scope', '$log', '$location', 'VkService', 'ConfigService', LoginViewController]);