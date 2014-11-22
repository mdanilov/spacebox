function MainViewController ($scope, $log, $timeout, LocatorService, MeetService, ErrorHandler) {
    $log.debug('Initialize main view controller...');

    var self = this;
    self.status = '';
    self.current = null;
    $scope.app.isNavbarHidden = false;

    self.Like = function () {
        self.current.like = 1;
        self.current = LocatorService.getNextUser();

        if (angular.isUndefined(self.current)) {
            searchLoop();
        }

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
        self.current = LocatorService.getNextUser();
//        MeetService.asyncDislike(current.mid).then(null, function () {
//            current.like = 0;
//        });
    };

    self.Undo = function () {
        self.current = LocatorService.getPreviousUser();
    };

    function searchLoop () {
        self.status = 'search';
        LocatorService.asyncSearch().then(function (count) {
            self.status = 'done';
            if (count > 0) {
                self.current = LocatorService.getNextUser();
            }
            else {
                $log.debug('No users has been founded');
                $timeout(searchLoop, 10000);
            }
        }, ErrorHandler.handle);
    }

    searchLoop();
}

MainViewController.resolve = {
//    'users': function (LocatorService, ErrorService) {
//        return LocatorService.asyncSearch().then(null, ErrorService.handleError);
//    }
};

angular.module('spacebox').controller('MainViewController',
    ['$scope', '$log', '$timeout', 'LocatorService', 'MeetService', 'ErrorHandler', MainViewController]);
