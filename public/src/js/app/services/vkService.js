function VkOAuthService ($window, $http, $log, $cookieStore, $q, $timeout, ConfigService) {

    var VkService = {};

    VkService.VERSION = 5.25;
    VkService.SCOPE = VK.access.FRIENDS | VK.access.PHOTOS;
    VkService.DISPLAY = { PAGE: 'page', POPUP: 'popup', MOBILE: 'mobile' };
    VkService.REDIRECT_URL = ConfigService.CORDOVA ?
        'https://oauth.vk.com/blank.html' : ConfigService.SERVER_URL + '/mobile/login';
    VkService.FIELDS = 'sex,bdate,first_name,photo_50,photo_100,screen_name';
    VkService.EMPTY_PHOTO = 'https://vk.com/images/camera_400.gif';

    VkService._appId = ConfigService.VK_MOBILE_APP_ID;
    var session = $cookieStore.get('vk.session');
    if (angular.isObject(session) && session.expires > Date.now()) {
        $log.debug('[vk] Load OAuth2 session ', session);
        VkService._session = session;
        if (ConfigService.CORDOVA) {
            trackVisitorStandalone();
        }
    }

    function trackVisitorStandalone () {
        if (!trackVisitorStandalone.resolved) {
            $log.debug('[vk] Track visitor');
            asyncApiCall('stats.trackVisitor').then(function () {
                trackVisitorStandalone.resolved = true;
            });
        }
    }

    function saveVkSession (data) {
        $log.debug('[vk] Save OAuth2 session ', data);
        VkService._session = data;
        $cookieStore.put('vk.session', data);
    }

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

    function asyncCordovaLogin (url) {
        var deferred = $q.defer();
        var authWindow = $window.open(url, '_blank', 'location=no');
        authWindow.addEventListener('loadstop', function (event) {
            if (event.url.split('#')[0] == VkService.REDIRECT_URL) {
                var code = event.url.split('#')[1].split('=')[1];
                $http.get(ConfigService.SERVER_URL + '/mobile/login', {params: {code: code, standalone: true}}).
                    success(function (data, status, headers, config) {
                        saveVkSession(data);
                        trackVisitorStandalone();
                        deferred.resolve(data.mid);
                        authWindow.close();
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject(new HttpError(status, 'VK login failed'));
                        authWindow.close();
                    });
            }
        });
        return deferred.promise;
    }

    VkService.asyncLogin = function () {
        var url = 'https://oauth.vk.com/authorize?' +
            'client_id=' + VkService._appId + '&scope=' + VkService.SCOPE +
            '&redirect_uri=' + VkService.REDIRECT_URL +
            '&display=' + VkService.DISPLAY.MOBILE + '&response_type=' + 'code';
        if (ConfigService.CORDOVA) {
            return asyncCordovaLogin(url);
        }
        else {
            return $timeout(function () {
                $window.location.href = url;
            });
        }
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
                        saveVkSession(data);
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

function VkOpenApiService ($http, $log, $q, ConfigService) {

    var VkService = {};

    VkService.VERSION = 5.25;
    VkService.SCOPE = VK.access.FRIENDS | VK.access.PHOTOS;
    VkService.FIELDS = 'sex, bdate, first_name, photo_50, photo_100, screen_name';
    VkService.EMPTY_PHOTO = 'https://vk.com/images/camera_400.gif';

    VK.init({ apiId: ConfigService.VK_WEBSITE_APP_ID });

    function asyncLoginToServer (session) {
        return $http.post(ConfigService.SERVER_URL + '/login', session).catch(function (response) {
            return $q.reject(new HttpError(response.status, 'VK login failed'));
        });
    }

    VkService.initLikeWidget = function (selector) {
        VK.Widgets.Like(selector, {type: "button", height: 24}, 29);
    };

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
        var deferred = $q.defer();
        VK.Auth.login(function (response) {
            if (response.session) {
                $log.debug('VK session ', response.session);
                return asyncLoginToServer(response.session).then(function () {
                    deferred.resolve(response.session.mid);
                });
            }
            else {
                deferred.reject(new HttpError(401, 'VK login failed'));
            }
        }, VkService.SCOPE);
        return deferred.promise;
    };

    VkService.asyncLogout =  function () {
        return $http.get(ConfigService.SERVER_URL + '/logout').catch(function (response) {
            return $q.reject(new HttpError(response.status, 'VK logout failed'));
        });
    };

    VkService.asyncGetUsersInfo = function (ids) {
        var deferred = $q.defer();
        VK.Api.call('users.get', {
            user_ids: ids, fields: VkService.FIELDS, v: VkService.VERSION
        }, function (data) {
            if (angular.isDefined(data.error)) {
                deferred.reject(new VkError(data.error));
            }
            deferred.resolve(data.response);
        });
        return deferred.promise;
    };

    VkService.asyncGetPhotos = function (id) {
        var deferred = $q.defer();
        VK.Api.call('photos.get', {
            owner_id: id, album_id: 'profile', v: VkService.VERSION
        }, function (data) {
            if (angular.isDefined(data.error)) {
                deferred.reject(new VkError(data.error));
            }

            if (angular.isObject(data.response) &&
                angular.isNumber(data.response.count) &&
                angular.isArray(data.response.items)) {
                var photos = [];
                for (var i = data.response.count - 1; i >= 0 && photos.length <= ConfigService.MAX_USER_PHOTOS; i--) {
                    if (data.response.items[i].photo_807) {
                        photos.push(data.response.items[i].photo_807);
                    }
                }

                if (photos.length == 0) {
                    photos.push(VkService.EMPTY_PHOTO);
                }

                deferred.resolve(photos);
            }
            else {
                deferred.reject(new HttpError(417, 'VK photos.get response invalid'));
            }
        });
        return deferred.promise;
    };

    VkService.asyncGetLoginStatus = function () {
        var deferred = $q.defer();
        VK.Auth.getLoginStatus(function (response) {
            if (response.session) {
                $log.debug('VK session ', response.session);
                return asyncLoginToServer(response.session).then(function () {
                    deferred.resolve(response.session.mid);
                });
            } else {
                deferred.reject(new HttpError(401, 'VK OpenAPI user is not authorized'));
            }
        });
        return deferred.promise;
    };

    VkService.asyncDestroy = function () {
        var deferred = $q.defer();
        VK.Auth.logout(function () {
            deferred.resolve();
        });
        return deferred.promise;
    };

    return VkService;
}

function VkServiceProvider () {
    var api = 'openapi';
    var VK_API = ['openapi', 'oauth'];

    this.useApi = function (value) {
        if (angular.isString(value) && VK_API.indexOf(value) != -1) {
            api = value;
        }
    };

    this.$get = ['$window', '$http', '$log', '$cookieStore', '$q', '$timeout', 'ConfigService',
        function ($window, $http, $log, $cookieStore, $q, $timeout, ConfigService) {
            if (api === 'openapi') {
                return VkOpenApiService($http, $log, $q, ConfigService);
            }
            else if (api === 'oauth') {
                return VkOAuthService($window, $http, $log, $cookieStore, $q, $timeout, ConfigService);
            }
            else {
                throw new Error('Unknown VK API');
            }
        }];
}

angular.module('spacebox').provider('VkService', VkServiceProvider);
