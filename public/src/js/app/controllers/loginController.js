function LoginViewController ($scope, $log, $location, VkService, UserService, ConfigService, ErrorHandler) {
    $log.debug('Initialize login view controller...');

    $scope.app.isNavbarHidden = true;

    if (VkService.hasOwnProperty('initLikeWidget')) {
        VkService.initLikeWidget('vkLike');
    }

    $scope.images = [
        {
            text: 'Ставьте лайки тем, кто вам нравится. Вы узнаете друг о друге только при взаимной симпатии',
            url: "src/img/screens/users.jpg"
        },
        {
            text: 'А вот что будет, если вы понравитесь друг другу. Не бойтесь начать общение первым',
            url: "src/img/screens/like.jpg"
        },
        {
            text: 'Только друзья могут видеть ваше местоположение и когда вы были онлайн',
            url: "src/img/screens/friends.jpg"
        },
        {
            text: 'Может быть прямо сейчас рядом с вами кто-то хочет сходить в кино?',
            url: "src/img/screens/map.jpg"
        },
        {
            text: 'Вы можете общаться с друзьями в приложении. Или продолжить в сети ВКонтакте',
            url: "src/img/screens/chat.jpg"
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