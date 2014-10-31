function FriendsViewController ($scope, $log, MapService, MeetService, ErrorService) {
    $log.debug('Initialize friends view...');

    var self = this;
    self.friends = [];

    MapService.init();

    function invalidateFriends (users) {
        $log.debug('Array of friends: ', users);
        self.friends = users;
        MapService.invalidateUsers(users);
    }

    MeetService.asyncGetFriends().then(invalidateFriends, function (error) {
        $log.error('Can\'t get friends');
        ErrorService.handleError(error);
    });
}

angular.module('spacebox').controller('FriendsViewController',
    ['$scope', '$log', 'MapService', 'MeetService', 'ErrorService', FriendsViewController]);