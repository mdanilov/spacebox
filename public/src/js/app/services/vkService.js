function VkService ($http, $log, $q, ConfigService) {

    var VkService = {};

    VkService.VERSION = 5.25;
    VkService.SCOPE = VK.access.FRIENDS | VK.access.PHOTOS;
    VkService.FIELDS = 'sex, bdate, first_name, photo_50, photo_100, screen_name';
    VkService.EMPTY_PHOTO = 'https://vk.com/images/camera_400.gif';

    VK.init({ apiId: ConfigService.VK_APP_ID });

    function asyncLoginToServer (session) {
        var deferred = this;
        $http.post(ConfigService.SERVER_URL + '/login', session).
            success(function (data, status, headers, config) {
                deferred.resolve(session.mid);
            }).
            error(function (data, status, headers, config) {
                deferred.reject(new HttpError(status, 'VK login failed'));
            });
    }

    VkService.asyncLogin = function () {
        var deferred = $q.defer();
        VK.Auth.login(function (response) {
            if (response.session) {
                $log.debug('VK session ', response.session);
                asyncLoginToServer.bind(deferred)(response.session);
            }
            else {
                deferred.reject(new HttpError(401, 'VK login failed'));
            }
        }, VkService.SCOPE);
        return deferred.promise;
    };

    VkService.asyncLogout =  function () {
        var deferred = $q.defer();
        $http.get(ConfigService.SERVER_URL + '/logout').
            success(function (data, status, headers, config) {
                deferred.resolve();
            }).
            error(function (data, status, headers, config) {
                deferred.reject(new HttpError(status, 'VK logout failed'));
            });
        return deferred.promise;
    };

    VkService.asyncGetUsersInfo = function (ids) {
        var deferred = $q.defer();
        if (angular.isUndefined(ids) || ids.length == 0) {
            deferred.resolve();
        }
        VK.Api.call('users.get', { user_ids: ids, fields: VkService.FIELDS }, function (r) {
            if (r.response) {
                deferred.resolve(r.response);
            }
            else {
                deferred.reject(new VkError(r));
            }
        });
        return deferred.promise;
    };

    VkService.asyncGetPhotos = function (id) {
        var deferred = $q.defer();
        VK.Api.call('photos.get', { owner_id: id, album_id: 'profile', v: VkService.VERSION }, function (r) {
            if (r.response) {
                var photos = [];
                for (var i = r.response.count - 1; i >= 0 && photos.length <= ConfigService.MAX_USER_PHOTOS; i--) {
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
                deferred.reject(new VkError(r));
            }
        });
        return deferred.promise;
    };

    VkService.asyncGetLoginStatus = function () {
        var deferred = $q.defer();
        VK.Auth.getLoginStatus(function (response) {
            if (response.session) {
                $log.debug('VK session ', response.session);
                asyncLoginToServer.bind(deferred)(response.session);
            } else {
                deferred.reject(new HttpError(401, 'VK OpenAPI unauthorized'));
            }
        });
        return deferred.promise;
    };

    return VkService;
}

angular.module('spacebox').factory('VkService',
    ['$http', '$log', '$q', 'ConfigService', VkService]);
