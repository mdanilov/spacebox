function FriendsService ($q, $resource, $window, $log, $rootScope, $interval, localStorageService, VkService, ConfigService) {

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
        if (data.location) {
            this.location.timestamp = new Date(data.location.timestamp);
        }
    }
    Friend.prototype.isRecent = function () {
        return this.recent == true;
    };
    Friend.prototype.hasLocation = function () {
        return this.hasOwnProperty('location');
    };
    Friend.prototype.isOnline = function () {
        return this.hasOwnProperty('location') &&
            (Date.now() - this.location.timestamp.getTime()) < ConfigService.USER_ONLINE_TIME_SEC * 1000;
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

    function queryResources () {
        function asyncAttachInfo (data) {
            var ids = getFriendIds(data);
            return VkService.asyncGetUsersInfo(ids).then(function (info) {
                angular.forEach(data, function (item, i) {
                    item.info = info[i];
                });
                return data;
            });
        }

        return _resource.query().$promise.then(function (data) {
            return $q.when(data.length > 0 ? asyncAttachInfo(data) : data).then(function (data) {
                updateFriends(data);
                return _friends;
            });
        });
    }

    FriendsService.hasRecent = function () {
        return _counter.recent > 0;
    };

    FriendsService.recent = function () {
        return _counter.recent;
    };

    FriendsService.getFriends = function (callback) {
        queryResources().then(function () {
            if (angular.isFunction(callback)) {
                callback(_friends);
            }
        });
        if (angular.isUndefined(_friends.interval)) {
            _friends.interval = $interval(queryResources,
                ConfigService.FRIENDS_UPDATE_INTERVAL_SEC * 1000);
        }
        return _friends;
    };

    return FriendsService;
}

angular.module('spacebox').factory('FriendsService',
    ['$q', '$resource', '$window', '$log', '$rootScope', '$interval', 'localStorageService', 'VkService', 'ConfigService', FriendsService]);
