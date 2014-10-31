function ErrorService ($location, ConfigService) {

    var ErrorService = {};

    ErrorService.handleError = function (error) {
        if (error == 401) {
            $location.path('/login');
            ConfigService.isLogin = false;
        }
        else {
            $location.path('/error');
        }
    };

    return ErrorService;
}

angular.module('spacebox').factory('ErrorService',
    ['$location', 'ConfigService', ErrorService]);
