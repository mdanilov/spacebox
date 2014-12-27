var spacebox = angular.module('spacebox',
    [ 'ngAnimate', 'ngRoute', 'ngTouch', 'ngCookies', 'angular-carousel', 'angularMoment', 'LocalStorageModule', 'ui.bootstrap.modal', 'ui.bootstrap.tpls']);

spacebox.config(['$routeProvider', '$logProvider',
    function ($routeProvider, $logProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'src/js/app/templates/views/login-view.html',
                controller: 'LoginViewController'
            }).
            when('/', {
                templateUrl: 'src/js/app/templates/views/main-view.html',
                controller: 'MainViewController',
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
                controller: 'PropertiesViewController',
                resolve: PropertiesViewController.resolve
            }).
            otherwise({
                redirectTo: '/login'
            });

        if (!angular.equals(CONFIG.DEVELOPMENT, true)) {
            $logProvider.debugEnabled(false);
        }
    }]);

spacebox.run(['$rootScope', '$location', '$log', '$route', 'VkService', 'ConfigService', 'UserService', 'ErrorHandler', 'amMoment',
    function ($rootScope, $location, $log, $route, VkService, ConfigService, UserService, ErrorHandler, amMoment) {
        amMoment.changeLocale('ru');
        $rootScope.$on('$locationChangeStart', function (event) {
            var path = $location.path();
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
