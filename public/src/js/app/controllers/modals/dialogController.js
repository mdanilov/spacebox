function dialogController ($scope, $modalInstance) {
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

angular.module('spacebox').controller('dialogController',
    ['$scope', '$modalInstance', dialogController]);