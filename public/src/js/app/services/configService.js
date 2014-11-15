function ConfigService ($cookieStore) {

    var ConfigService = {};

    ConfigService.VK_APP_ID = 4213835;
    ConfigService.MAX_USER_PHOTOS = 6;
    ConfigService.SERVER_URL = window.location.origin;
    ConfigService._login = false;
    ConfigService._config = $cookieStore.get('config');

    function isValid (config) {
        var valid = false;
        if (angular.isObject(config)) {
            if (angular.isNumber(config.radius) &&
                angular.isNumber(config.sex) &&
                angular.isObject(config.ageInterval)) {
                var interval = config.ageInterval;
                if (angular.isNumber(interval.top) &&
                    angular.isNumber(interval.bottom)) {
                    valid = true;
                }
            }
        }
        return valid;
    }

    if (!isValid(ConfigService._config)) {
        ConfigService._config = {
            radius: 15000,
            sex: 0,
            ageInterval: {
                top: 99,
                bottom: 18
            }
        }
    }

    ConfigService.isAuthorized = function () {
        return ConfigService._login;
    };

    ConfigService.getSearchOptions = function () {
        return ConfigService._config;
    };

    ConfigService.update = function (info) {
        var options = ConfigService._config;

        // age is defined
        if (info.age > 0) {
            var top = info.age + 5;
            var bottom = info.age - 5;
            options.ageInterval.top = top > 99 ? 99 : top;
            options.ageInterval.bottom = bottom < 0 ? 0 : bottom;
        }

        // sex is defined
        if (info.sex != 0) {
            options.sex = 3 - info.sex;
        }

        ConfigService._config = options;
        ConfigService._login = true;
        $cookieStore.put('config', ConfigService._config);
    };

    return ConfigService;
}

angular.module('spacebox').factory('ConfigService',
    ['$cookieStore', ConfigService]);