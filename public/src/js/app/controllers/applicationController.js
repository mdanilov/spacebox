function ApplicationController ($scope, $log, $cookieStore, UserService, ConfigService) {
    $log.debug('Initialize application controller...');

    var self = this;
    self.user = {};
    self.isNavbarHidden = false;
    self.isMatched = false;

    $scope.$watch(function () { return ConfigService._login },
        function (value) {
            if (angular.equals(value, true)) {
                self.user = UserService.getInfo();
            }
        });
}

angular.module('spacebox').controller('ApplicationController',
    ['$scope', '$log', '$cookieStore', 'UserService', 'ConfigService', ApplicationController]);
