var spacebox = angular.module('spacebox',
    [ 'ngAnimate', 'ngRoute', 'ngTouch', 'ngCookies']);

spacebox.config(['$routeProvider', '$logProvider', '$compileProvider',
    function ($routeProvider, $logProvider, $compileProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'src/js/app/templates/login-view.html',
                controller: 'LoginViewController'
            }).
            when('/', {
                templateUrl: 'src/js/app/templates/main-view.html',
                controller: 'MainViewController',
                resolve: MainViewController.resolve,
                controllerAs: 'main'
            }).
            when('/friends', {
                templateUrl: 'src/js/app/templates/friends-view.html',
                controller: 'FriendsViewController',
                controllerAs: 'friends'
            }).
            when('/error', {
                templateUrl: 'src/js/app/templates/error-view.html',
                controller: 'ErrorViewController'
            }).
            otherwise({
                redirectTo: '/login'
            });

        if (!angular.equals(config.development, true)) {
            $logProvider.debugEnabled(false);
            $compileProvider.debugInfoEnabled(false);
        }
    }]);

spacebox.run(['$rootScope', '$location', '$log', 'VkService', 'ConfigService',
    function ($rootScope, $location, $log, VkService, ConfigService) {
        $rootScope.$on('$locationChangeStart', function ($event) {
            var path = $location.path();
            if (!ConfigService.isLogin && path != '/login') {
                // TODO: prevent event don't work as assumed
                // $event.preventDefault();
                VkService.asyncGetLoginStatus().then(function () {
                    $log.debug('User already authorized go to %s', path);
                    ConfigService.isLogin = true;
                    $location.path(path);
                }, function (error) {
                    $log.debug('Prevent to load \'%s\', user is not authorized', path);
                    $location.path('/login');
                });
            }
    });
}]);
