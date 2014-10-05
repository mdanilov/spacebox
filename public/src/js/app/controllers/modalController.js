function ModalController ($scope, $log, $modalInstance, VkService) {

    $log.debug('Initialize modal controller...');

    $scope.items = [];
    $scope.selected = {
        index: 0,
        item: {}
    };

    // TODO: use resolve to passed user into controller
    VkService.getPhotos($scope.$parent.user.uid, function (error, data) {
        if (error) {
            $modalInstance.dismiss('cancel');
        }

        $scope.items = data;
        $scope.selected.item = data[0];
        $scope.selected.index = 1;
        $scope.$apply();
    });

    $scope.onClick = function () {
        $scope.selected.index = ($scope.selected.index != $scope.items.length) ?
            ($scope.selected.index + 1) : 1;
        $scope.selected.item = $scope.items[$scope.selected.index - 1];
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

angular.module('spacebox')
    .controller('ModalController', ['$scope', '$log', '$modalInstance', 'VkService', ModalController]);
