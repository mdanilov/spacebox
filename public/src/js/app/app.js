var spacebox = angular.module('spacebox',
    [ 'ngAnimate', 'ngRoute', 'ngTouch', 'ui.bootstrap.buttons', 'ui.bootstrap.tpls']);

spacebox.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'src/js/app/templates/login-page.html',
                controller: 'LoginViewController'
            }).
            when('/', {
                templateUrl: 'src/js/app/templates/main-page.html',
                controller: 'MainViewController',
                controllerAs: 'main'
            }).
            when('/friends', {
                templateUrl: 'src/js/app/templates/friends-view.html',
                controller: 'FriendsViewController',
                controllerAs: 'friends'
            }).
            when('/error', {
                templateUrl: 'src/js/app/templates/error-page.html',
                controller: 'ErrorViewController'
            }).
            otherwise({
                redirectTo: '/login'
            });
    }]);

spacebox.run(['$rootScope', '$location', '$log', 'VkService', 'ConfigService',
    function ($rootScope, $location, $log, VkService, ConfigService) {
        $rootScope.$on('$locationChangeStart', function ($event) {
            var path = $location.path();
            if (!ConfigService.isLogin && path != '/login') {
                // TODO: prevent event don't work as assumed
                // $event.preventDefault();
                VkService.getLoginStatus(function (error, status) {
                    if (error || !status) {
                        $log.debug('Prevent to load \'%s\', user is not authorized', path);
                        $location.path('/login');
                    }
                    else {
                        ConfigService.isLogin = true;
                        $location.path('/');
                    }
                });
            }
    });
}]);
