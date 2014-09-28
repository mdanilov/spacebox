function VkService ($http, $log) {

    var VkService = {};

    VkService.SCOPE = 'FRIENDS';
    VkService.FIELDS = 'first_name, photo_50, screen_name';
    VkService._id = 0;

    VK.init({ apiId: config.vkApiId });

    function LoginToServer (data, callback) {
        $http.get(config.serverUrl + '/login', {data: data}).
            success(function (data, status, headers, config) {
                callback(null);
            }).
            error(function (data, status, headers, config) {
                callback(status);
            });
    }

    VkService.login = function (callback) {
        VK.Auth.login(function (response) {
            if (response.session) {
                $log.debug('VK user id%s has been authorized', response.session.mid);
                _id = response.session.mid;
                LoginToServer(response.session, callback);
            }
            else {
                $log.error('Can\'t authorized VK user');
                callback(401);
            }
        }, VK.access[SCOPE]);
    };

    VkService.logout =  function (callback) {
        $http.get(config.serverUrl + '/logout').
            success(function (data, status, headers, config) {
                VK.Auth.logout();
                callback(null);
            }).
            error(function (data, status, headers, config) {
                callback(status);
            });
    };

    VkService.getUsersInfo = function (ids, callback) {
        if (ids.length == 0) {
            return;
        }

        VK.Api.call('users.get', { user_ids: uids, fields: FIELDS }, function (r) {
            if (r.response) {
                callback(null, r.response);
            }
            else {
                $log.error('Can\'t get VK users information');
                callback(401);
            }
        });
    };

    VkService.call = function (method, options, callback) {
        VK.Api.call(method, options, callback);
    };

    VkService.getLoginStatus = function (callback) {
        VK.Auth.getLoginStatus(function (response) {
            if (response.session) {
                $log.debug('VK user id%s already authorized', response.session.mid);
                _id = response.session.mid;
                LoginToServer(response.session, callback);
            } else {
                $log.error('Can\'t get current VK login status');
                callback(401);
            }
        });
    };

    return VkService;
}

angular.module('spacebox.vkService', [])
    .factory('VkService', ['$http', '$log', VkService]);
