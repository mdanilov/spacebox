function HttpError (status, message) {
    this.name = 'HttpError ' + status;
    this.status = status;
    this.message = message;
}
HttpError.prototype = new Error();

function VkError (error) {
    this.name = 'VkError';
    this.message = JSON.stringify(error);
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
        var message = "";
        if (errorFlag) {
            message += 'Geolocation is off';
            $log.error(message);
            window.alert(message);
        } else {
            message += 'Browser does not support geolocation';
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
