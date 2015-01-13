var spacebox = angular.module('spacebox',
    [ 'ngAnimate', 'ngRoute', 'ngResource', 'ngTouch', 'ngCookies', 'angular-carousel', 'angularMoment', 'LocalStorageModule', 'ui.bootstrap.modal', 'ui.bootstrap.tpls']);

spacebox.config(['config', '$routeProvider', '$logProvider', '$compileProvider',
    function (config, $routeProvider, $logProvider, $compileProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'src/js/app/templates/views/login.html',
                controller: 'LoginViewController'
            }).
            when('/', {
                templateUrl: 'src/js/app/templates/views/users.html',
                controller: 'UsersViewController',
                controllerAs: 'main'
            }).
            when('/friends', {
                templateUrl: 'src/js/app/templates/views/friends.html',
                controller: 'FriendsViewController',
                controllerAs: 'friends'
            }).
            when('/error', {
                templateUrl: 'src/js/app/templates/views/error.html',
                controller: 'ErrorViewController'
            }).
            when('/properties', {
                templateUrl: 'src/js/app/templates/views/properties.html',
                controller: 'PropertiesViewController'
            }).
            otherwise({
                redirectTo: '/login'
            });

        if (!angular.equals(config.DEVELOPMENT, true)) {
            $compileProvider.debugInfoEnabled(false);
            $logProvider.debugEnabled(false);
        }
    }]);

spacebox.run(['$rootScope', '$location', '$log', '$route', 'VkService', 'ConfigService', 'UserService', 'ErrorHandler', 'amMoment', 'localStorageService',
    function ($rootScope, $location, $log, $route, VkService, ConfigService, UserService, ErrorHandler, amMoment, localStorageService) {
        amMoment.changeLocale('ru');

        if (Modernizr.standalone) {
            var path = localStorageService.get('app.path');
            if (angular.isUndefined(path)) {
                localStorageService.set('app.path', $location.path());
            }
            $location.path(path);
        }

        $rootScope.$on('$locationChangeStart', function (event) {
            var path = $location.path();

            if (Modernizr.standalone) {
                localStorageService.set('app.path', path);
            }

            if (!ConfigService.isAuthorized() && path != '/login') {
                event.preventDefault();
                VkService.asyncGetLoginStatus().then(function (id) {
                    $log.debug('User is authorized, change location path to ', path);
                    UserService.asyncUpdateInfo(id).then(function (info) {
                        ConfigService.init(info);
                        $route.reload();
                    }, ErrorHandler.handle);
                }, function (error) {
                    $log.debug('User is not authorized, prevent location change ', path);
                    $location.path('/login');
                });
            }
    });
}]);