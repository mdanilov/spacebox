function FriendsViewController ($scope, $log, MapService, MeetService) {
    $log.debug('Initialize friends view...');

    this.friends = [];
    MapService.init();

    var InvalidateFriends = angular.bind(this, function (users) {
        $log.debug('Array of friends: ', users);
        this.friends = users;
        MapService.invalidateUsers(users);
    });

    MeetService.asyncGetFriends().then(InvalidateFriends, function () {
        $log.error('Can\'t get friends');
    });
}

angular.module('spacebox')
    .controller('FriendsViewController', ['$scope', '$log', 'MapService', 'MeetService', FriendsViewController]);