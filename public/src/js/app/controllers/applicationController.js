function ApplicationController ($scope, $log, VkService, StateService) {
    $log.debug('Initialize application controller...');

    this.user = {};

    var fillUserInfo = angular.bind(this.user, function (error, info) {
        if (error) {
            return;
        }
        this.name = info[0].first_name;
        this.image = info[0].photo_50;
        $scope.$apply();
    });

    $scope.$watch(function () { return StateService.isLogin },
        function (newValue, oldValue) {
            if (angular.equals(newValue, true)) {
                VkService.getCurrentUserInfo(fillUserInfo);
            }
        });
}

angular.module('spacebox')
    .controller('ApplicationController', ['$scope', '$log', 'VkService', 'StateService', ApplicationController]);