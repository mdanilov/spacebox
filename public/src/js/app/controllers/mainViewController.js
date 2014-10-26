function MainViewController ($scope, $log, LocatorService, MeetService, users) {
    $log.debug('Initialize main view controller...');

    var self = this;
    self.users = users;
    self.current = LocatorService.getFirstNewUser();

    self.Search = function () {
        LocatorService.asyncSearch().then(function (users) {
            self.users = users;
            self.current = LocatorService.getFirstNewUser();
        });
    };

    self.Like = function () {
        self.current.like = 1;
        self.current = LocatorService.getFirstNewUser();
//        MeetService.asyncLike(current.mid).then(function () {
//            if (current.likeMe == 1) {
//                // TODO: show modal window
//            }
//        }, function () {
//            current.like = 0;
//        });
    };

    self.Dislike = function () {
        self.current.like = -1;
        self.current = LocatorService.getFirstNewUser();
//        MeetService.asyncDislike(current.mid).then(null, function () {
//            current.like = 0;
//        });
    };
}

MainViewController.resolve = {
    'users': function (LocatorService) {
        return LocatorService.asyncSearch();
    }
};

angular.module('spacebox')
    .controller('MainViewController',
        ['$scope', '$log', 'LocatorService', 'MeetService', MainViewController]);
