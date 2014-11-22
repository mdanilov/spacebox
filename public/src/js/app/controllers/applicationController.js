function ApplicationController ($scope, $log, UserService, ConfigService) {
    $log.debug('Initialize application controller...');

    var self = this;
    self.user = {};
    self.isNavbarHidden = false;

    $scope.$watch(function () { return ConfigService._login },
        function (value) {
            if (angular.equals(value, true)) {
                self.user = UserService.getInfo();
            }
        });
}

angular.module('spacebox').controller('ApplicationController',
    ['$scope', '$log', 'UserService', 'ConfigService', ApplicationController]);
