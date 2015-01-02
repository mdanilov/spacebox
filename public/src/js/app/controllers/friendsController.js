function FriendsViewController ($scope, $log, $location, $interval, MapService, FriendsService, ErrorHandler, StatusService, MessagesService) {
    $log.debug('Initialize friends view...');

    var self = this;
    self.friends = [];
    self.current = undefined;
    self.list = true;
    self.statusUpdater = undefined;
    self.STATUS_UPDATE_INTERVAL = 300000; // 5 minutes
    self.isChatOpen = false;

    self.toggle = function (value) {
        self.list = value;
    };

    self.find = function () {
        $location.path('/');
    };

    self.openMap = self.toggle.bind(null, false);

    MapService.init();

    var statusUpdateInterval = $interval(updateStatus, self.STATUS_UPDATE_INTERVAL);
    self.friends = FriendsService.getFriends(function () {
        $log.debug('Friends: ', self.friends);
        if (angular.isArray(self.friends) && self.friends.length > 0) {
            self.state = 'ready';
            updateStatus();
        }
        else {
            self.state = 'empty';
        }
    });

    self.state = angular.isUndefined(self.friends.$resolved) ? 'loading' : 'ready';

    function updateStatus () {
        if (self.friends.length > 0) {
            var uids = self.friends.map(function (friend) {
                return friend.mid;
            });
            StatusService.get(uids).then(function (data) {
                var j = 0;
                self.friends.forEach(function __addStatus(friend) {
                    if (angular.isDefined(data[j]) && friend.mid === data[j].mid) {
                        friend.status = data[j++].text;
                    }
                });

                MapService.invalidateUsers(self.friends);
            });
        }
    }
    
    self.openChat = function () {
        self.isChatOpen = true;
    };

    self.closeChat = function () {
        self.isChatOpen = false;
    };

    $scope.$on('$destroy', function () {
        if (angular.isDefined(statusUpdateInterval)) {
            $interval.cancel(statusUpdateInterval);
        }
    });
}

angular.module('spacebox').controller('FriendsViewController',
    ['$scope', '$log', '$location', '$interval', 'MapService', 'FriendsService', 'ErrorHandler', 'StatusService', 'MessagesService', FriendsViewController]);