function FriendsViewController ($scope, $log, $location, MapService, FriendsService) {
    $log.debug('Initialize friends view...');

    var self = this;
    self.friends = [];
    self.current = undefined;
    self.tab = 'friends';
    self.isChatOpen = false;

    self.find = function () {
        $location.path('/');
    };

    self.openMap = function () {
        self.tab = 'map';
    };

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
    self.state = (self.friends.resolved === true) ? 'ready' : 'loading';

    self.openChat = function () {
        self.isChatOpen = true;
    };

    self.closeChat = function () {
        self.isChatOpen = false;
    };
}

angular.module('spacebox').controller('FriendsViewController',
    ['$scope', '$log', '$location', 'MapService', 'FriendsService', FriendsViewController]);