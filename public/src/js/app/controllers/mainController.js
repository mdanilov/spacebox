function MainViewController ($scope, $log, $timeout, LocatorService, FriendsService, ErrorHandler) {
    $log.debug('Initialize main view controller...');

    var self = this;
    self.status = '';
    self.current = null;
    self.searchTimer = undefined;

    $scope.app.isNavbarHidden = false;

    self.Like = function () {
        self.current.like = 1;
        self.current = LocatorService.getNextUser();

        if (angular.isUndefined(self.current)) {
            searchLoop();
        }

//        FriendsService.asyncLike(current.mid).then(function () {
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
//        FriendsService.asyncDislike(current.mid).then(null, function () {
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
                self.searchTimer = $timeout(searchLoop, 20000);
            }
        }, ErrorHandler.handle);
    }

    searchLoop();

    $scope.$on('$destroy', function __destroy (event) {
        if (angular.isDefined(self.searchTimer)) {
            $timeout.cancel(self.searchTimer);
        }
    });
}

angular.module('spacebox').controller('MainViewController',
    ['$scope', '$log', '$timeout', 'LocatorService', 'FriendsService', 'ErrorHandler', MainViewController]);
