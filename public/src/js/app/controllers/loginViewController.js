function LoginViewController ($scope, $log, $location, VkService, StateService) {
    $log.debug('Initialize login view controller...');

    $scope.Login = function () {
        $log.debug('Try login to VK...');
        VkService.login(function (error) {
            if (!error) {
                StateService.isLogin = true;
                $location.path('/');
            }
        });
    }
}

angular.module('spacebox')
    .controller('LoginViewController',
        ['$scope', '$log', '$location', 'VkService', 'StateService', LoginViewController]);