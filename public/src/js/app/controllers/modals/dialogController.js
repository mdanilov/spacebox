function dialogController ($scope, $modalInstance, text) {
    $scope.text = text;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

angular.module('spacebox').controller('dialogController',
    ['$scope', '$modalInstance', 'text', dialogController]);