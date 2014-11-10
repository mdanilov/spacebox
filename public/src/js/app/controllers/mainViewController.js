function MainViewController ($scope, $log, LocatorService, MeetService, ErrorService) {
    $log.debug('Initialize main view controller...');

    var self = this;
    self.status = '';
    self.current = null;
    $scope.app.isNavbarHidden = false;

    self.Search = function () {
        self.status = 'search';
        LocatorService.asyncSearch().then(function () {
            self.status = 'done';
            self.current = LocatorService.nextUser();
        });
    };

    self.Like = function () {
        self.current.like = 1;
        self.current = LocatorService.nextUser();
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
        self.current = LocatorService.nextUser();
//        MeetService.asyncDislike(current.mid).then(null, function () {
//            current.like = 0;
//        });
    };

    self.Search();
}

MainViewController.resolve = {
//    'users': function (LocatorService, ErrorService) {
//        return LocatorService.asyncSearch().then(null, ErrorService.handleError);
//    }
};

angular.module('spacebox').controller('MainViewController',
    ['$scope', '$log', 'LocatorService', 'MeetService', 'ErrorService', MainViewController]);
