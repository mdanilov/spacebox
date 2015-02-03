function ApplicationController ($scope, $log, $injector, UserService, ConfigService) {
    $log.debug('Start application controller');

    var self = this;

    self.user = {};
    self.isNavbarHidden = false;
    self.isMobile = ConfigService.CORDOVA;
    self.isMatched = false;

    function bootstrapApplication () {
        self.user = UserService.getInfo();

        self.MessagesService = $injector.get('MessagesService');
        self.FriendsService = $injector.get('FriendsService');

        function checkEvents () {
            return self.FriendsService.recent() + self.MessagesService.unreadMessages();
        }

        self.events = checkEvents();
        $scope.$watch(checkEvents, function (value) {
            self.events = value
        });
    }

    $scope.$watch(function () { return ConfigService._login }, function (value) {
        if (angular.equals(value, true)) {
            bootstrapApplication();
        }
    });
}

angular.module('spacebox').controller('ApplicationController',
    ['$scope', '$log', '$injector', 'UserService', 'ConfigService', ApplicationController]);
