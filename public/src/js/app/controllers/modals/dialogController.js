function DialogController ($scope, $modalInstance, text) {
    $scope.text = text;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

angular.module('spacebox').controller('DialogController',
    ['$scope', '$modalInstance', 'text', DialogController]);