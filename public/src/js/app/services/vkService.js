function VkService ($http, $log, $q, ConfigService) {

    var VkService = {};

    VkService.VERSION = 5.25;
    VkService.SCOPE = VK.access.FRIENDS | VK.access.PHOTOS;
    VkService.FIELDS = 'sex, bdate, first_name, photo_50, photo_100, screen_name';
    VkService.EMPTY_PHOTO = 'https://vk.com/images/camera_400.gif';

    VK.init({ apiId: ConfigService.VK_APP_ID });

    function asyncLoginToServer (session) {
        return $http.post(ConfigService.SERVER_URL + '/login', session).catch(function (response) {
            return $q.reject(new HttpError(response.status, 'VK login failed'));
        });
    }

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

            if (angular.isArray(data.response) && data.response.length > 0) {
                deferred.resolve(data.response);
            }
            else {
                return deferred.reject(new HttpError(417, 'VK users.get response invalid'));
            }
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

    return VkService;
}

angular.module('spacebox').factory('VkService',
    ['$http', '$log', '$q', 'ConfigService', VkService]);
