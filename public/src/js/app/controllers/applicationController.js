function ApplicationController ($scope, $log, UserService, ConfigService) {
    $log.debug('Initialize application controller...');

    var self = this;
    self.user = {};
    self.isNavbarHidden = false;

    function updateConfig (info) {
        // age is defined
        if (info.age > 0) {
            var top = info.age + 5;
            var bottom = info.age - 5;
            ConfigService.searchOptions.ageInterval.top = top > 99 ? 99 : top;
            ConfigService.searchOptions.ageInterval.bottom = bottom < 0 ? 0 : bottom;
        }

        // sex is defined
        if (info.sex != 0) {
            ConfigService.searchOptions.sex = 3 - info.sex;
        }
    }

    $scope.$watch(function () { return ConfigService.isLogin },
        function (value) {
            if (angular.equals(value, true)) {
                var userInfo = UserService.getInfo();
                updateConfig(userInfo);
                self.user = userInfo;
            }
        });
}

angular.module('spacebox').controller('ApplicationController',
    ['$scope', '$log', 'UserService', 'ConfigService', ApplicationController]);
