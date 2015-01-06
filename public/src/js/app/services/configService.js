function ConfigService (config, $cookieStore) {

    var ConfigService = {};

    ConfigService.FRIENDS_UPDATE_INTERVAL_SEC = 120; // 2 minute

    ConfigService.CHAT_MESSAGES_COUNT = 20;
    ConfigService.CHAT_PRINT_TIME = 60; // 1 minute

    ConfigService.MAPBOX = {
        ACCESS_TOKEN: 'pk.eyJ1IjoibWRhbmlsb3YiLCJhIjoiV29JVmpxdyJ9.sBimZ4oSZYSFTdcZIgnQfQ',
        URL: 'mdanilov.j8f4ggll'
    };

    ConfigService.VK_WEBSITE_APP_ID = 4688098;
    ConfigService.VK_MOBILE_APP_ID = 4213835;
    ConfigService.MAX_USER_PHOTOS = 6;
    ConfigService.MAX_STATUS_LENGTH = 100;
    ConfigService.SERVER_URL = config.SERVER_URL || window.location.origin;
    ConfigService.VERSION = config.VERSION;
    ConfigService._login = false;
    ConfigService._config = $cookieStore.get('config');

    function validateSearchOptions (options) {
        if (angular.isNumber(options.radius) &&
            angular.isNumber(options.sex) &&
            angular.isObject(options.ageInterval)) {
            var interval = options.ageInterval;
            if (angular.isNumber(interval.top) &&
                angular.isNumber(interval.bottom)) {
                return true;
            }
        }

        return false;
    }

    function isValid (config) {
        var valid = false;
        if (angular.isObject(config)) {
            if (angular.isObject(config.map) &&
                angular.isObject(config.search)) {
                if (validateSearchOptions(ConfigService._config.search)) {
                    valid = true;
                }
            }
        }
        return valid;
    }

    if (!isValid(ConfigService._config)) {
        ConfigService._config = {
            init: false,
            map: {
                zoom: 15
            },
            search: {
                radius: 15000,
                sex: 0,
                ageInterval: {
                    top: 99,
                    bottom: 18
                }
            }
        }
    }

    ConfigService.isAuthorized = function () {
        return ConfigService._login;
    };

    ConfigService.getSearchOptions = function () {
        return ConfigService._config.search;
    };

    ConfigService.setSearchOptions = function (options) {
        if (!validateSearchOptions(options)) {
            return;
        }
        ConfigService._config.search = options;
        $cookieStore.put('config', ConfigService._config);
    };

    ConfigService.getMapOptions = function () {
        return ConfigService._config.map;
    };

    ConfigService.init = function (info) {
        if (!ConfigService._config.init) {
            var options = ConfigService._config.search;

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

            ConfigService._config.search = options;
            ConfigService._config.init = true;
        }
        ConfigService._login = true;
        $cookieStore.put('config', ConfigService._config);
    };

    return ConfigService;
}

angular.module('spacebox').factory('ConfigService',
    ['config', '$cookieStore', ConfigService]);