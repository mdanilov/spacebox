function FriendsViewController ($scope, $log) {

    $log.debug('Initialize friends view...');
}

angular.module('spacebox')
    .controller('FriendsViewController', ['$scope', '$log', FriendsViewController]);