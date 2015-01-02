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

    self.friends = FriendsService.getFriends(function () {
        $log.debug('Friends: ', self.friends);
        if (angular.isArray(self.friends) && self.friends.length > 0) {
            self.state = 'ready';
        }
        else {
            self.state = 'empty';
        }
    });

    MapService.invalidateUsers(self.friends);

    self.state = angular.isUndefined(self.friends.$resolved) ? 'loading' : 'ready';

    self.openChat = function () {
        self.isChatOpen = true;
    };

    self.closeChat = function () {
        self.isChatOpen = false;
    };
}

angular.module('spacebox').controller('FriendsViewController',
    ['$scope', '$log', '$location', '$interval', 'MapService', 'FriendsService', 'ErrorHandler', 'StatusService', 'MessagesService', FriendsViewController]);