function FriendsViewController ($scope, $log, MapService, MeetService) {
    $log.debug('Initialize friends view...');

    var self = this;

    self.friends = [];
    MapService.init();

    function invalidateFriends (users) {
        $log.debug('Array of friends: ', users);
        self.friends = users;
        MapService.invalidateUsers(users);
    }

    MeetService.asyncGetFriends().then(invalidateFriends, function () {
        $log.error('Can\'t get friends');
    });
}

angular.module('spacebox')
    .controller('FriendsViewController', ['$scope', '$log', 'MapService', 'MeetService', FriendsViewController]);