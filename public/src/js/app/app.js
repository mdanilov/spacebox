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

spacebox.run(['$timeout', '$rootScope', '$location', '$log', '$route', 'VkService', 'ConfigService', 'UserService', 'ErrorHandler', 'amMoment', 'localStorageService',
    function ($timeout, $rootScope, $location, $log, $route, VkService, ConfigService, UserService, ErrorHandler, amMoment, localStorageService) {
        amMoment.changeLocale('ru');
        $rootScope.$on('$locationChangeStart', function (event) {
            var path = $location.path();

            if (Modernizr.standalone) {
                localStorageService.set('app.route', path);
            }

            function login (info) {
                ConfigService.init(info);
                if (Modernizr.standalone) {
                    var route = localStorageService.get('app.route');
                    if (angular.isUndefined(route)) {
                        localStorageService.set('app.route', $location.path());
                    }
                    else {
                        $timeout($location.path(route));
                    }
                }

                $route.reload();
            }

            if (!ConfigService.isAuthorized() && path != '/login') {
                event.preventDefault();
                VkService.asyncGetLoginStatus().then(function (id) {
                    $log.debug('User is authorized, change location path to ', path);
                    UserService.asyncUpdateInfo(id).then(login, ErrorHandler.handle);
                }, function (error) {
                    $log.debug('User is not authorized, prevent location change ', path);
                    $location.path('/login');
                });
            }
    });
}]);