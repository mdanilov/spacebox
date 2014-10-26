function MainViewController ($scope, $log, VkService, GeolocationService, MeetService) {
    $log.debug('Initialize main view controller...');

    var self = this;

    self.users = [];
    self.current = null;

    function invalidateUsers (users) {
        var uids = [];
        for (var i = 0; i < users.length; i++) {
            uids.push(users[i].mid);
        }

        VkService.asyncGetUsersInfo(uids).then(function (info) {
            $log.debug('VK users info collected: ', info);
            for (var i = 0; i < info.length; i++) {
                users[i].info = info[i];
            }
            self.users = users;
            selectCurrent();
         }, function (error) {
            $log.error('Can\'t get VK users info due to error: ', error);
        });
    }

    function selectCurrent () {
        var users = self.users;
        for (var i = 0; i < users.length; i++) {
            if (users[i].like == 0) {
                self.current = users[i];
                return;
            }
        }
        self.current = null;
    }

    self.Search = function () {
        $log.debug('Try to search near users...');
        GeolocationService.asyncGetUserPositions(15000).then(function (data) {
            $log.debug('Founded near users locations: ', data);
            invalidateUsers(data);
        }, function (error) {
            $log.error('Can\'t get near users due to error: ', error);
        });
    };

    self.Like = function () {
        var current = self.current;
        current.like = 1;
        selectCurrent();
//        MeetService.asyncLike(current.mid).then(function () {
//            if (current.likeMe == 1) {
//                // TODO: show modal window
//            }
//        }, function () {
//            current.like = 0;
//        });
    };

    self.Dislike = function () {
        var current = self.current;
        current.like = -1;
        selectCurrent();
//        MeetService.asyncDislike(current.mid).then(null, function () {
//            current.like = 0;
//        });
    };

    self.Search();
}

MainViewController.resolve = {
//    users: function (GeolocationService) {
//        return GeolocationService.asyncGetUsers(15000);
//    }
};

angular.module('spacebox')
    .controller('MainViewController',
        ['$scope', '$log', 'VkService', 'GeolocationService', 'MeetService', MainViewController]);
