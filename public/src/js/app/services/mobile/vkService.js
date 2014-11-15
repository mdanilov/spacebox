function VkService ($http, $log, $cookieStore, $q, $location, ConfigService) {

    var VkService = {};

    VkService.VERSION = 5.25;
    VkService.SCOPE = VK.access.FRIENDS | VK.access.PHOTOS;
    VkService.DISPLAY = { PAGE: 'page', POPUP: 'popup', MOBILE: 'mobile' };
    VkService.SERVER_URL = $location.protocol() + '://' + $location.host() + ':' + $location.port();
    VkService.REDIRECT_URL = VkService.SERVER_URL + '/mobile/login';
    VkService.FIELDS = 'sex, bdate, first_name, photo_50, photo_100, screen_name';
    VkService.EMPTY_PHOTO = 'https://vk.com/images/camera_400.gif';

    VkService._appId = ConfigService.vkApiId;
    VkService._session = $cookieStore.get('vk.session');

    function vkApiCall (method, options, callback) {
        var url = 'https://api.vk.com/method/' + method;
        var data = options;
        data.access_token = VkService._session.access_token;

        $http.get(url, {params: data }).
            success(function (data, status, headers, config) {
                callback(data);
            }).
            error(function (data, status, headers, config) {
                $log.debug('VK call error: %', status);
                callback(null);
            });
    }

    VkService.asyncLogin = function () {
        var deferred = $q.defer();

        window.location.href = 'https://oauth.vk.com/authorize?' +
            'client_id=' + VkService._appId + '&scope=' + VkService.SCOPE +
            '&redirect_uri=' + VkService.REDIRECT_URL +
            '&display=' + VkService.DISPLAY.MOBILE + '&response_type=' + 'code';

        return deferred.promise;
    };

    VkService.asyncLogout =  function () {
        var deferred = $q.defer();
        $http.get(VkService.SERVER_URL + '/logout').
            success(function (data, status, headers, config) {
                $cookieStore.remove('vk.session');
                deferred.resolve();
            }).
            error(function (data, status, headers, config) {
                deferred.reject(status);
            });
        return deferred.promise;
    };

    VkService.asyncGetUsersInfo = function (ids) {
        var deferred = $q.defer();
        if (!ids || ids.length == 0) {
            deferred.reject();
        }
        else if (angular.isArray(ids)) {
            ids = ids.join(',');
        }
        vkApiCall('users.get', { user_ids: ids, fields: VkService.FIELDS }, function (r) {
            if (r.response) {
                deferred.resolve(r.response);
            }
            else {
                $log.error('Can\'t get VK users information');
                deferred.reject(r.error);
            }
        });
        return deferred.promise;
    };

    VkService.asyncGetPhotos = function (id) {
        var deferred = $q.defer();
        vkApiCall('photos.get', { owner_id: id, album_id: 'profile', v: VkService.VERSION }, function (r) {
            if (r.response) {
                var photos = [];
                for (var i = r.response.count - 1; i >= 0 && photos.length <= ConfigService.maxPhoto; i--) {
                    if (r.response.items[i].photo_807) {
                        photos.push(r.response.items[i].photo_807);
                    }
                }

                if (photos.length == 0) {
                    photos.push(VkService.EMPTY_PHOTO);
                }

                deferred.resolve(photos);
            }
            else {
                $log.error('Can\'t get VK photos');
                deferred.reject(r.error);
            }
        });
        return deferred.promise;
    };

    VkService.asyncGetLoginStatus = function () {
        var deferred = $q.defer();

        var date = new Date();
        if (!angular.isUndefined(VkService._session) &&
            VkService._session.expires < date.getTime()) {
            deferred.resolve(VkService._session.mid);
        }
        else {
            $http.get(VkService.SERVER_URL + '/mobile/getLoginStatus').
                success(function (data, status, headers, config) {
                    if (data.access_token) {
                        $log.debug('VK user id%s already authorized', data.mid);
                        VkService._session = data;
                        $cookieStore.put('vk.session', data);
                        deferred.resolve(data.mid);
                    }
                    else {
                        deferred.reject(401);
                    }
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
        }

        return deferred.promise;
    };

    return VkService;
}

angular.module('spacebox').factory('VkService',
    ['$http', '$log', '$cookieStore', '$q', '$location', 'ConfigService', VkService]);