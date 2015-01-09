function FriendsService ($resource, $window, $log, $rootScope, $interval, localStorageService, VkService, ConfigService) {

    var FriendsService = {};

    var _friends = [];
    var _counter = {
        recent: 0
    };
    var _resource = $resource(ConfigService.SERVER_URL + '/friends.get', null, {
        'query':  {
            method: 'GET',
            isArray: true,
            transformResponse: transformResponse
        }
    });

    (function () {
        var store = localStorageService.get('friends');
        if (angular.isArray(store)) {
            _friends = store.map(function (data) {
                if (data.recent == true) {
                    _counter.recent++;
                }
                return new Friend(data);
            });
            _friends.resolved = true;
        }
    }());

    function Friend (data) {
        angular.extend(this, data || {});
    }
    Friend.prototype.isRecent = function () {
        return this.recent == true;
    };
    Friend.prototype.hasLocation = function () {
        return this.hasOwnProperty('location');
    };
    Friend.prototype.view = function () {
        if (this.recent == true) {
            if (Modernizr.standalone) {
                saveFriends();
            }
            _counter.recent--;
        }
        this.recent = false;
    };

    function getFriendIds (friends) {
        return friends.map(function (friend) {
            return friend.mid;
        });
    }

    function transformResponse (response) {
        var data = angular.fromJson(response);

        var ids = getFriendIds(_friends);
        var hasNewFriends = false;
        angular.forEach(data, function (item) {
            var pos = ids.indexOf(item.mid);
            if ((pos == -1) || _friends[pos].isRecent()) {
                item.recent = true;
                hasNewFriends = true;
            }
        });

        if (Modernizr.standalone) {
            saveFriends();
        }

        if (hasNewFriends) {
            $rootScope.$broadcast('friends.new');
        }

        return data;
    }

    function saveFriends () {
        $log.debug('[friends] Save friends to local storage', _friends);
        localStorageService.set('friends', _friends);
    }

    angular.element($window).on('unload', saveFriends);
    angular.element($window).on('pagehide', saveFriends);

    FriendsService.addFriend = function (user) {
        var i = 0;
        while (i < _friends.length) {
            if (_friends[i].mid == user.mid) {
                break;
            }
            ++i;
        }
        if (i == _friends.length) {
            _friends.push(new Friend(user));
        }
    };

    function updateFriends (data) {
        if (_friends.length > data.length) {
            _friends.splice(data.length);
        }

        _counter.recent = 0;
        for (var i = 0; i < data.length; ++i) {
            if (data[i].recent == true) {
                _counter.recent++;
            }
            _friends[i] = new Friend(data[i]);
        }

        _friends.resolved = true;
    }

    function queryResources (callback) {
        _resource.query().$promise.then(function (data) {
            var ids = getFriendIds(data);
            return VkService.asyncGetUsersInfo(ids).then(function (info) {
                angular.forEach(data, function (item, i) {
                    item.info = info[i];
                });
                updateFriends(data);
                if (angular.isFunction(callback)) {
                    callback(_friends);
                }
            });
        });
    }

    FriendsService.hasRecent = function () {
        return _counter.recent > 0;
    };

    FriendsService.getFriends = function (callback) {
        queryResources(callback);
        if (angular.isUndefined(_friends.interval)) {
            _friends.interval = $interval(queryResources,
                ConfigService.FRIENDS_UPDATE_INTERVAL_SEC * 1000);
        }
        return _friends;
    };

    return FriendsService;
}

angular.module('spacebox').factory('FriendsService',
    ['$resource', '$window', '$log', '$rootScope', '$interval', 'localStorageService', 'VkService', 'ConfigService', FriendsService]);
