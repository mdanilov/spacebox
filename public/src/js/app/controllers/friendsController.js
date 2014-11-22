function FriendsViewController ($scope, $log, MapService, MeetService, ErrorHandler) {
    $log.debug('Initialize friends view...');

    var self = this;
    self.friends = [];
    self.list = true;

    self.toggle = function (value) {
        self.list = value;
    };

    self.openMap = self.toggle.bind(null, false);

    MapService.init();

    function invalidateFriends (users) {
        $log.debug('Friends: ', users);
        self.friends = users;
        MapService.invalidateUsers(users);
    }

    MeetService.asyncGetFriends().then(invalidateFriends, ErrorHandler.handle);
}

angular.module('spacebox').controller('FriendsViewController',
    ['$scope', '$log', 'MapService', 'MeetService', 'ErrorHandler', FriendsViewController]);