var spacebox = angular.module('spacebox', [
    'ngRoute',
    'pageControllers',
    'badgeDirective'
]);

spacebox.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'templates/login-page.html',
                controller: 'LoginPageController'
            }).
            when('/main', {
                templateUrl: 'templates/main-page.html',
                controller: 'MainPageController'
            }).
            when('/error', {
                templateUrl: 'templates/error-page.html',
                controller: 'ErrorPageController'
            }).
            otherwise({
                redirectTo: '/login'
            });
    }]);
