function VkService ($http, $log, $cookieStore, $q, $location, ConfigService) {

    var VkService = {};

    VkService.VERSION = 5.25;
    VkService.SCOPE = VK.access.FRIENDS | VK.access.PHOTOS;
    VkService.DISPLAY = { PAGE: 'page', POPUP: 'popup', MOBILE: 'mobile' };
    VkService.SERVER_URL = window.location.origin;
    VkService.REDIRECT_URL = VkService.SERVER_URL + '/mobile/login';
    VkService.FIELDS = 'sex, bdate, first_name, photo_50, photo_100, screen_name';
    VkService.EMPTY_PHOTO = 'https://vk.com/images/camera_400.gif';

    VkService._appId = ConfigService.vkApiId;
    VkService._session = $cookieStore.get('vk.session');

    function asyncApiCall (method, options) {
        var deferred = $q.defer();
        if (angular.isUndefined(VkService._session)) {
            deferred.reject(401);
        }
        else {
            var url = 'https://api.vk.com/method/' + method;
            var data = options;
            data.access_token = VkService._session.access_token;

            $http.get(url, {params: data }).
                success(function (data, status, headers, config) {
                    if (data.response) {
                        deferred.resolve(data.response);
                    }
                    deferred.reject(data.error);
                }).
                error(function (data, status, headers, config) {
                    $log.error('VK call error: %', status);
                    deferred.reject(status);
                });
        }
        return deferred.promise;
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
        asyncApiCall('users.get', { user_ids: ids, fields: VkService.FIELDS }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            $log.error('Can\'t get VK users information');
            deferred.reject(error);
        });
        return deferred.promise;
    };

    VkService.asyncGetPhotos = function (id) {
        var deferred = $q.defer();
        asyncApiCall('photos.get', { owner_id: id, album_id: 'profile', v: VkService.VERSION }).then(function (response) {
            var photos = [];
            for (var i = response.count - 1; i >= 0 && photos.length <= ConfigService.maxPhoto; i--) {
                if (response.items[i].photo_807) {
                    photos.push(response.items[i].photo_807);
                }
            }
            if (photos.length == 0) {
                photos.push(VkService.EMPTY_PHOTO);
            }
            deferred.resolve(photos);
        }, function (error) {
            $log.error('Can\'t get VK photos');
            deferred.reject(error);
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