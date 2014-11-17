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

function GeoError (errorFlag) {
    this.name = 'GeolocationError';
    if (errorFlag) {
        this.message = 'Geolocation is off';
    } else {
        this.message = 'Browser does not support geolocation';
    }
}
GeoError.prototype = new Error();

function ErrorHandler ($log, $location, ConfigService) {
    var ErrorHandler = {};

    ErrorHandler.handle = function (error) {
        if (error instanceof Error) {
            ErrorHandler._lastError = error;
            $log.error(error);
            if (error instanceof HttpError) {
                if (error.status === 401) {
                    $location.path('/login');
                    ConfigService.isLogin = false;
                }
            }
            else if (error instanceof GeoError) {
                $location.path('/error');
            }
            else {
                window.alert('Что-то пошло не так.\nПопробуйте повторить позже.');
            }
        }
        else {
            window.alert('Неизвестная ошибка.');
        }
    };

    ErrorHandler.getLastError = function () {
        return ErrorHandler._lastError;
    };

    return ErrorHandler;
}

angular.module('spacebox').factory('ErrorHandler',
    ['$log', '$location', 'ConfigService', ErrorHandler]);
