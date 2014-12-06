function FriendsViewController ($scope, $log, $location, MapService, FriendsService, ErrorHandler) {
    $log.debug('Initialize friends view...');

    var self = this;
    self.friends = [];
    self.list = true;
    self.state = 'loading';

    self.toggle = function (value) {
        self.list = value;
    };

    self.find = function () {
        $location.path('/');
    };

    self.openMap = self.toggle.bind(null, false);

    MapService.init();

    function invalidateFriends (users) {
        $log.debug('Friends: ', users);
        if (angular.isArray(users) && users.length != 0) {
            self.friends = users;
            self.state = 'ready';
            MapService.invalidateUsers(users);
        }
        else {
            self.state = 'empty';
        }
    }

    FriendsService.asyncGetFriends().then(invalidateFriends, ErrorHandler.handle);
}

angular.module('spacebox').controller('FriendsViewController',
    ['$scope', '$log', '$location', 'MapService', 'FriendsService', 'ErrorHandler', FriendsViewController]);