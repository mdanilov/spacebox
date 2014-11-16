var spacebox = angular.module('spacebox',
    [ 'ngAnimate', 'ngRoute', 'ngTouch', 'ngCookies']);

spacebox.config(['$routeProvider', '$logProvider', '$compileProvider',
    function ($routeProvider, $logProvider, $compileProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'src/js/app/templates/views/login-view.html',
                controller: 'LoginViewController'
            }).
            when('/', {
                templateUrl: 'src/js/app/templates/views/main-view.html',
                controller: 'MainViewController',
                resolve: MainViewController.resolve,
                controllerAs: 'main'
            }).
            when('/friends', {
                templateUrl: 'src/js/app/templates/views/friends-view.html',
                controller: 'FriendsViewController',
                controllerAs: 'friends'
            }).
            when('/error', {
                templateUrl: 'src/js/app/templates/views/error-view.html',
                controller: 'ErrorViewController'
            }).
            when('/properties', {
                templateUrl: 'src/js/app/templates/views/properties-view.html',
                controller: 'PropertiesViewController'
            }).
            otherwise({
                redirectTo: '/login'
            });

        if (!angular.equals(config.development, true)) {
            $logProvider.debugEnabled(false);
            $compileProvider.debugInfoEnabled(false);
        }
    }]);

spacebox.run(['$rootScope', '$location', '$log', 'VkService', 'ConfigService', 'UserService', 'ErrorHandler',
    function ($rootScope, $location, $log, VkService, ConfigService, UserService, ErrorHandler) {
        $rootScope.$on('$locationChangeStart', function ($event) {
            var path = $location.path();
            if (!ConfigService.isAuthorized() && path != '/login') {
                // TODO: prevent event don't work as assumed
                // $event.preventDefault();
                VkService.asyncGetLoginStatus().then(function (id) {
                    $log.debug('User is authorized, change location path to ', path);
                    UserService.asyncUpdateInfo(id).then(function (info) {
                        ConfigService.update(info);
                        $location.path(path);
                    }, ErrorHandler.handle);
                }, function (error) {
                    $log.debug('User is not authorized, prevent location change ', path);
                    $location.path('/login');
                });
            }
    });
}]);
