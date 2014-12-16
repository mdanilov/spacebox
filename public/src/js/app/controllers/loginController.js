function LoginViewController ($scope, $log, $location, VkService, UserService, ConfigService, ErrorHandler) {
    $log.debug('Initialize login view controller...');

    $scope.app.isNavbarHidden = true;

    $scope.images = [
        {
            text: 'Анонимно ставьте "Нравится" или "Пропустить"',
            url: "src/img/login-1.jpg"
        },
        {
            text: 'Что будет, если вы понравитесь друг другу',
            url: "src/img/login-2.jpg"
        },
        {
            text: 'Общайтесь с дурзьями в приложении',
            url: "src/img/login-3.jpg"
        },
        {
            text: 'Находите друзей рядом',
            url: "src/img/login-4.jpg"
        }
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