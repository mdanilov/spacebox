function VkService ($http, $log, $cookieStore, $q, ConfigService) {

    var VkService = {};

    VkService.VERSION = 5.25;
    VkService.SCOPE = VK.access.FRIENDS | VK.access.PHOTOS;
    VkService.FIELDS = 'sex, bdate, first_name, photo_50, photo_100, screen_name';
    VkService._id = $cookieStore.get('vkUserId');

    VK.init({ apiId: config.vkApiId });

    function asyncLoginToServer (data) {
        var deferred = this;
        VkService._id = data.mid;
        $cookieStore.put('vkUserId', VkService._id);
        $http.get(config.serverUrl + '/login', {params: data}).
            success(function (data, status, headers, config) {
                deferred.resolve();
            }).
            error(function (data, status, headers, config) {
                $log.debug('Failed login to server: %', status);
                deferred.reject();
            });
    }

    VkService.asyncLogin = function () {
        var deferred = $q.defer();
        VK.Auth.login(function (response) {
            if (response.session) {
                $log.debug('VK user id%s has been authorized', response.session.mid);
                asyncLoginToServer.bind(deferred)(response.session);
            }
            else {
                $log.error('Can\'t authorized VK user');
                deferred.reject(response.status);
            }
        }, VkService.SCOPE);
        return deferred.promise;
    };

    VkService.asyncLogout =  function () {
        var deferred = $q.defer();
        $http.get(config.serverUrl + '/logout').
            success(function (data, status, headers, config) {
                $cookieStore.remove('vkUserId');
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
        VK.Api.call('users.get', { user_ids: ids, fields: VkService.FIELDS }, function (r) {
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

    VkService.asyncGetCurrentUserInfo = function () {
        var deferred = $q.defer();
        if (angular.isUndefined(VkService._id)) {
            $log.info('User is not authorized');
            deferred.reject();
        }
        VkService.asyncGetUsersInfo(VkService._id).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    VkService.asyncGetPhotos = function (id) {
        var deferred = $q.defer();
        VK.Api.call('photos.get', { owner_id: id, album_id: 'profile', v: VkService.VERSION }, function (r) {
            if (r.response) {
                var photos = [];
                for (var i = 0; i < r.response.count && photos.length <= ConfigService.maxPhoto; i++) {
                    if (r.response.items[i].photo_807) {
                        photos.push(r.response.items[i].photo_807);
                    }
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
        VK.Auth.getLoginStatus(function (response) {
            if (response.session) {
                $log.debug('VK user id%s already authorized', response.session.mid);
                asyncLoginToServer.bind(deferred)(response.session);
            } else {
                $log.debug('VK user is not authorized using OpenAPI');
                deferred.reject();
            }
        });
        return deferred.promise;
    };

    return VkService;
}

angular.module('spacebox')
    .factory('VkService', ['$http', '$log', '$cookieStore', '$q', 'ConfigService', VkService]);
