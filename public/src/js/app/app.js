var spacebox = angular.module('spacebox',
    [ 'ngAnimate', 'ngRoute', 'ui.bootstrap.modal', 'ui.bootstrap.buttons', 'ui.bootstrap.tpls']);

spacebox.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'src/js/app/templates/login-page.html',
                controller: 'LoginPageController'
            }).
            when('/', {
                templateUrl: 'src/js/app/templates/main-page.html',
                controller: 'MainPageController'
            }).
            when('/error', {
                templateUrl: 'src/js/app/templates/error-page.html',
                controller: 'ErrorPageController'
            }).
            otherwise({
                redirectTo: '/login'
            });
    }]);

spacebox.run(['$rootScope', '$location', '$log', 'VkService', 'ConfigService',
    function ($rootScope, $location, $log, VkService, ConfigService) {
        $rootScope.$on('$locationChangeStart', function ($event) {
            var path = $location.path();
            if (!ConfigService.isAuthorized && path != '/login') {
                // TODO: prevent event don't work as assumed
                // $event.preventDefault();
                VkService.getLoginStatus(function (error, status) {
                    if (error || !status) {
                        $log.debug('Prevent to load \'%s\', user is not authorized', path);
                        $location.path('/login');
                    }
                    else {
                        ConfigService.isAuthorized = true;
                        $location.path('/');
                    }
                });
            }
    });
}]);