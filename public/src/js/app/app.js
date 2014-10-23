var spacebox = angular.module('spacebox',
    [ 'ngAnimate', 'ngRoute', 'ngTouch', 'ngCookies', 'ui.bootstrap.buttons', 'ui.bootstrap.tpls']);

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

spacebox.run(['$rootScope', '$location', '$log', 'VkService', 'StateService',
    function ($rootScope, $location, $log, VkService, StateService) {
        $rootScope.$on('$locationChangeStart', function ($event) {
            var path = $location.path();
            if (!StateService.isLogin && path != '/login') {
                // TODO: prevent event don't work as assumed
                // $event.preventDefault();
                VkService.asyncGetLoginStatus().then(function () {
                    StateService.isLogin = true;
                    $location.path('/');
                }, function (error) {
                    $log.debug('Prevent to load \'%s\', user is not authorized', path);
                    $location.path('/login');
                });
            }
    });
}]);
