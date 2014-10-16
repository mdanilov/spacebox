function ApplicationController ($scope, $log, VkService, ConfigService) {
    $log.debug('Initialize application controller...');

    this.user = {};

    $scope.$watch(function () { return ConfigService.isLogin },
        (function (newValue, oldValue) {
            if (newValue == true) {
                VkService.getCurrentUserInfo((function (error, info) {
                    if (error) {
                        return;
                    }
                    this.user.name = info[0].first_name;
                    this.user.image = info[0].photo_50;
                    $scope.$apply();
                }).bind(this));
            }
        }).bind(this));
}

angular.module('spacebox')
    .controller('ApplicationController', ['$scope', '$log', 'VkService', 'ConfigService', ApplicationController]);