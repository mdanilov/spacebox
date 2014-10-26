function ApplicationController ($scope, $log, VkService, ConfigService) {
    $log.debug('Initialize application controller...');

    var self = this;
    self.user = {};

    $scope.$watch(function () { return ConfigService.isLogin },
        function (value) {
            if (angular.equals(value, true)) {
                VkService.asyncGetCurrentUserInfo().then(function (info) {
                    self.user.name = info[0].first_name;
                    self.user.image = info[0].photo_50;
                });
            }
        });
}

angular.module('spacebox')
    .controller('ApplicationController', ['$scope', '$log', 'VkService', 'ConfigService', ApplicationController]);