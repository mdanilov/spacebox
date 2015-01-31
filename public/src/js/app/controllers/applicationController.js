function ApplicationController ($scope, $log, UserService, ConfigService, FriendsService, MessagesService) {
    $log.debug('Initialize application controller...');

    var self = this;

    self.user = {};
    self.isNavbarHidden = false;
    self.isMobile = ConfigService.CORDOVA;
    self.isMatched = false;
    self.events = checkEvents();

    $scope.$watch(checkEvents, function (value) {
        self.events = value
    });

    function checkEvents () {
        return FriendsService.recent() + MessagesService.unreadMessages();
    }

    $scope.$watch(function () { return ConfigService._login }, function (value) {
        if (angular.equals(value, true)) {
            self.user = UserService.getInfo();
        }
    });
}

angular.module('spacebox').controller('ApplicationController',
    ['$scope', '$log', 'UserService', 'ConfigService', 'FriendsService', 'MessagesService', ApplicationController]);
