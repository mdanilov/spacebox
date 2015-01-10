function VkService ($http, $log, $cookieStore, $q, $timeout, ConfigService) {

    var VkService = {};

    VkService.VERSION = 5.25;
    VkService.SCOPE = VK.access.FRIENDS | VK.access.PHOTOS;
    VkService.DISPLAY = { PAGE: 'page', POPUP: 'popup', MOBILE: 'mobile' };
    VkService.REDIRECT_URL = ConfigService.SERVER_URL + '/mobile/login';
    VkService.FIELDS = 'sex,bdate,first_name,photo_50,photo_100,screen_name';
    VkService.EMPTY_PHOTO = 'https://vk.com/images/camera_400.gif';

    VkService._appId = ConfigService.VK_MOBILE_APP_ID;
    var session = $cookieStore.get('vk.session');
    if (angular.isObject(session) &&
        session.expires > new Date().getTime()) {
        VkService._session = session;
    }

    trackVisitor.tracked = false;
    function trackVisitor () {
        if (!trackVisitor.tracked) {
            asyncApiCall('stats.trackVisitor').then(function () {
                trackVisitor.tracked = true;
            });
        }
    }

    trackVisitor();

    function asyncApiCall (method, options) {
        var deferred = $q.defer();
        if (angular.isUndefined(VkService._session)) {
            deferred.reject(new HttpError(401, 'VK session is undefined'));
        }
        else {
            var url = 'https://api.vk.com/method/' + method;
            var data = options || {};
            data.access_token = VkService._session.access_token;
            data.callback = 'JSON_CALLBACK';

            $http.jsonp(url, {params: data}).
                success(function (data, status, headers, config) {
                    if (!angular.isUndefined(data.error)) {
                        deferred.reject(new VkError(data.error));
                    }
                    deferred.resolve(data.response);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(new HttpError(status, 'VK call failed'));
                });
        }
        return deferred.promise;
    }

    VkService.getShareButtonWidget = function (html) {
        var type = html ? 'custom' : 'round_nocount';
        var info = {
            url: 'http://gofinder.ru',
            title: 'Finder',
            description: 'Сайт быстрых знакомств',
            noparse: false
        };
        return VK.Share.button(info, {
            type: type,
            text: html || 'Рассказать друзьям'
        });
    };

    VkService.asyncLogin = function () {
        return $timeout(function () {
            window.location.href = 'https://oauth.vk.com/authorize?' +
                'client_id=' + VkService._appId + '&scope=' + VkService.SCOPE +
                '&redirect_uri=' + VkService.REDIRECT_URL +
                '&display=' + VkService.DISPLAY.MOBILE + '&response_type=' + 'code';
        });
    };

    VkService.asyncLogout =  function () {
        var deferred = $q.defer();
        $http.get(ConfigService.SERVER_URL + '/logout').
            success(function (data, status, headers, config) {
                $cookieStore.remove('vk.session');
                deferred.resolve();
            }).
            error(function (data, status, headers, config) {
                deferred.reject(new HttpError(status, 'VK logout failed'));
            });
        return deferred.promise;
    };

    VkService.asyncGetUsersInfo = function (ids) {
        if (angular.isArray(ids)) {
            ids = ids.join(',');
        }
        return asyncApiCall('users.get', {
            user_ids: ids, fields: VkService.FIELDS, v: VkService.VERSION
        }).then(function (response) {
            if (angular.isArray(response) && response.length > 0) {
                return response;
            }
            else {
                return $q.reject(new HttpError(500));
            }
        });
    };

    VkService.asyncGetPhotos = function (id) {
        return asyncApiCall('photos.get', {
            owner_id: id, album_id: 'profile', v: VkService.VERSION
        }).then(function (response) {
            var photos = [];
            for (var i = response.count - 1; i >= 0 && photos.length <= ConfigService.MAX_USER_PHOTOS; i--) {
                if (response.items[i].photo_807) {
                    photos.push(response.items[i].photo_807);
                }
            }
            if (photos.length == 0) {
                photos.push(VkService.EMPTY_PHOTO);
            }
            return photos;

        });
    };

    VkService.asyncGetLoginStatus = function () {
        var deferred = $q.defer();

        if (VkService._session && VkService._session.expires < new Date().getTime()) {
            deferred.resolve(VkService._session.mid);
        }
        else {
            $http.get(ConfigService.SERVER_URL + '/mobile/getLoginStatus').
                success(function (data, status, headers, config) {
                    if (!angular.isUndefined(data.access_token)) {
                        $log.debug('VK session ', data);
                        VkService._session = data;
                        trackVisitor();
                        $cookieStore.put('vk.session', data);
                        deferred.resolve(data.mid);
                    }
                    else {
                        deferred.reject(new HttpError(401, 'VK access_token is null'));
                    }
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(new HttpError(status, 'VK login status failed'));
                });
        }

        return deferred.promise;
    };

    // TODO: revoke grants for application
    VkService.asyncDestroy = function () {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
    };

    return VkService;
}

angular.module('spacebox').factory('VkService',
    ['$http', '$log', '$cookieStore', '$q', '$timeout', 'ConfigService', VkService]);