function ApplicationController ($scope, $log, UserService, ConfigService, FriendsService, MessagesService) {
    $log.debug('Initialize application controller...');

    var self = this;
    self.user = {};
    self.isNavbarHidden = false;
    self.isMatched = false;
    self.recentFriends = FriendsService.hasRecent();
    self.unreadMessages = MessagesService.unreadMessages() > 0;

    $scope.$watch(FriendsService.hasRecent, function (value) {
        self.recentFriends = value;
        self.events = calculateEvents();
    });

    $scope.$watch(MessagesService.unreadMessages, function (value) {
        self.unreadMessages = value > 0;
        self.events = calculateEvents();
    });

    self.events = calculateEvents();

    function calculateEvents () {
        return self.recentFriends || self.unreadMessages;
    }

    $scope.$watch(function () { return ConfigService._login }, function (value) {
        if (angular.equals(value, true)) {
            self.user = UserService.getInfo();
        }
    });
}

angular.module('spacebox').controller('ApplicationController',
    ['$scope', '$log', 'UserService', 'ConfigService', 'FriendsService', 'MessagesService', ApplicationController]);
