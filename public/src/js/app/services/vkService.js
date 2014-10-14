function VkService ($http, $log) {

    var VkService = {};

    VkService.VERSION = 5.25;
    VkService.SCOPE = VK.access.FRIENDS | VK.access.PHOTOS;
    VkService.FIELDS = 'sex, bdate, first_name, photo_50, photo_100, screen_name';
    VkService._id = 0;

    VK.init({ apiId: config.vkApiId });

    function LoginToServer (data, callback) {
        $http.get(config.serverUrl + '/login', {params: data}).
            success(function (data, status, headers, config) {
                callback(null, true);
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
                callback(response.status);
            }
        }, VkService.SCOPE);
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

        VK.Api.call('users.get', { user_ids: ids, fields: VkService.FIELDS }, function (r) {
            if (r.response) {
                callback(null, r.response);
            }
            else {
                $log.error('Can\'t get VK users information');
                callback(r.error);
            }
        });
    };

    VkService.getCurrentUserInfo = function (callback) {
        if (VkService._id == 0) {
            $log.info('User is not authorized');
            return;
        }

        VkService.getUsersInfo(VkService._id, callback);
    };

    VkService.getPhotos = function (id, callback) {
        VK.Api.call('photos.get', { owner_id: id, album_id: 'profile', v: VkService.VERSION }, function (r) {
            if (r.response) {
                var photos = [];
                for (var i = 0; i < r.response.count; i++) {
                    if (r.response.items[i].photo_2560) {
                        photos.push(r.response.items[i].photo_2560);
                    }
                    else if (r.response.items[i].photo_1280){
                        photos.push(r.response.items[i].photo_1280);
                    }
                }
                callback(null, photos);
            }
            else {
                $log.error('Can\'t get VK photos');
                callback(r.error);
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
                $log.debug('VK user is not authorized using OpenAPI');
                callback(null, false);
            }
        });
    };

    return VkService;
}

angular.module('spacebox')
    .factory('VkService', ['$http', '$log', VkService]);
