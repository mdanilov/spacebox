function MatchController ($scope, $modalInstance, couple) {
    $scope.couple = couple;

    $scope.openFriends = function () {
        $modalInstance.close();
    };

    $scope.back = function () {
        $modalInstance.dismiss('cancel');
    };
}

angular.module('spacebox').controller('MatchController',
    ['$scope', '$modalInstance', 'couple', MatchController]);
