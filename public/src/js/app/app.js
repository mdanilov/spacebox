var spacebox = angular.module('spacebox',
    [ 'ngAnimate', 'ngRoute', 'ui.bootstrap.modal', 'ui.bootstrap.buttons', 'ui.bootstrap.tpls']);

spacebox.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'src/js/app/templates/login-page.html',
                controller: 'LoginPageController'
            }).
            when('/main', {
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
