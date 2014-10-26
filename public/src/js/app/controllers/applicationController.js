function ApplicationController ($scope, $log, VkService, ConfigService) {
    $log.debug('Initialize application controller...');

    var self = this;

    self.user = {};

    var fillUserInfo = angular.bind(self.user, function (info) {
        self.name = info[0].first_name;
        self.image = info[0].photo_50;
    });

    $scope.$watch(function () { return ConfigService.isLogin },
        function (value) {
            if (angular.equals(value, true)) {
                VkService.asyncGetCurrentUserInfo().then(fillUserInfo);
            }
        });
}

angular.module('spacebox')
    .controller('ApplicationController', ['$scope', '$log', 'VkService', 'ConfigService', ApplicationController]);