function ListController ($scope, $log) {

    $scope.radioModel = 'All';
}

angular.module('spacebox')
    .controller('ListController',
    ['$scope', '$log', ListController]);
