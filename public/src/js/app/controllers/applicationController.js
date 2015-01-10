function ApplicationController ($scope, $log, UserService, ConfigService, FriendsService) {
    $log.debug('Initialize application controller...');

    var self = this;
    self.user = {};
    self.isNavbarHidden = false;
    self.isMatched = false;
    self.events = FriendsService.hasRecent();

    $scope.$watch(FriendsService.hasRecent, function (value) {
        self.events = value;
    });

    $scope.$watch(function () { return ConfigService._login }, function (value) {
        if (angular.equals(value, true)) {
            self.user = UserService.getInfo();
        }
    });
}

angular.module('spacebox').controller('ApplicationController',
    ['$scope', '$log', 'UserService', 'ConfigService', 'FriendsService', ApplicationController]);
