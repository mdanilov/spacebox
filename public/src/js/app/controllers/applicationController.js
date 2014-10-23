function ApplicationController ($scope, $log, VkService, StateService) {
    $log.debug('Initialize application controller...');

    this.user = {};

    var fillUserInfo = angular.bind(this.user, function (info) {
        this.name = info[0].first_name;
        this.image = info[0].photo_50;
    });

    $scope.$watch(function () { return StateService.isLogin },
        function (newValue, oldValue) {
            if (angular.equals(newValue, true)) {
                VkService.asyncGetCurrentUserInfo().then(fillUserInfo);
            }
        });
}

angular.module('spacebox')
    .controller('ApplicationController', ['$scope', '$log', 'VkService', 'StateService', ApplicationController]);