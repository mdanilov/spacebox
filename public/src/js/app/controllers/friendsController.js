function FriendsViewController ($window, $scope, $log, $location, FriendsService) {
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

    self.friends = FriendsService.getFriends(function () {
        $log.debug('Friends: ', self.friends);
        if (angular.isArray(self.friends) && self.friends.length > 0) {
            self.state = 'ready';
        }
        else {
            self.state = 'empty';
        }
    });
    self.state = (self.friends.resolved === true) ? 'ready' : 'loading';

    $scope.$on('chat.open', function () {
        self.isChatOpen = true;
    });

    self.openProfile = function () {
        if (self.current) {
            $window.open('https://www.vk.com/id' + self.current.mid);
        }
    };

    self.openChat = function () {
        self.isChatOpen = true;
    };

    self.closeChat = function () {
        self.isChatOpen = false;
    };
}

angular.module('spacebox').controller('FriendsViewController',
    ['$window', '$scope', '$log', '$location', 'FriendsService', FriendsViewController]);