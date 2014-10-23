function FriendsViewController ($scope, $log, MapService, MeetService) {
    $log.debug('Initialize friends view...');

    this.friends = [];

    var InvalidateFriends = angular.bind(this, function (info) {
        $log.debug('Friends: ', info);

        var users = [];
        for (var i = 0; i < info.length; i++) {
            users[i] = {};
            users[i].bdate = info[i].bdate;
            users[i].photoUrl = info[i].photo_50;
            users[i].largePhotoUrl = info[i].photo_100;
            users[i].firstName = info[i].first_name;
            users[i].screenName = info[i].screen_name;
            users[i].uid = info[i].uid;
        }

        this.friends = users;

        //MapService.invalidateUsers(users);
    });

    MapService.init();

    MeetService.asyncGetFriends().then(InvalidateFriends, function () {
        $log.error('Can\'t get friends');
    });
}

angular.module('spacebox')
    .controller('FriendsViewController', ['$scope', '$log', 'MapService', 'MeetService', FriendsViewController]);