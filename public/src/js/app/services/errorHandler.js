function HttpError (status, message) {
    this.name = 'HttpError ' + status;
    this.status = status;
    this.message = message;
}
HttpError.prototype = new Error();

function VkError (message) {
    this.name = 'VkError';
    this.message = message;
}
VkError.prototype = new Error();

function ErrorHandler ($log, $location, ConfigService) {
    var ErrorHandler = {};
    ErrorHandler._lastError = new Error();

    ErrorHandler.handle = function (error) {
        ErrorHandler._lastError = error;
        $log.error(error);
        if (error instanceof HttpError) {
            if (error.status === 401) {
                $location.path('/login');
                ConfigService.isLogin = false;
            }
        }
        else {
            $location.path('/error');
        }
    };

    ErrorHandler.handleNoGeolocation = function (errorFlag) {
        if (errorFlag) {
            $log.error('Geolocation is off');
        } else {
            var message = 'Browser doesn\'t support geolocation';
            $log.error(message);
            ErrorHandler._lastError = new Error(message);
            $location.path('/error');
        }
    };

    ErrorHandler.getLastError = function () {
        return ErrorHandler._lastError;
    };

    return ErrorHandler;
}

angular.module('spacebox').factory('ErrorHandler',
    ['$log', '$location', 'ConfigService', ErrorHandler]);
