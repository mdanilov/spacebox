function MainViewController ($scope, $log, $timeout, $location, $modal, LocatorService, FriendsService, UserService, ErrorHandler) {
    $log.debug('Initialize main view controller...');

    var self = this;
    self.status = '';
    self.current = null;
    self.searchTimer = undefined;

    $scope.app.isNavbarHidden = false;

    self.Like = function () {
        self.current.like = 1;
        //FriendsService.asyncLike(current.mid).then(function () {

//        }, function () {
//            current.like = 0;
//        });

        if (self.current.likeMe == 1) {
            self.couple = [
                UserService.getInfo(),
                self.current.info
            ];

            var matchWindow = $modal.open({
                templateUrl: 'src/js/app/templates/modals/match.html',
                windowClass: 'sp-match-modal',
                backdropClass: 'sp-match-backdrop',
                controller: 'MatchController',
                resolve: {
                    couple: function () {
                        return self.couple;
                    }
                },
                size: 'sm',
                backdrop: 'static'
            });

            $scope.app.isMatched = true;
            matchWindow.result.finally(function () {
                $scope.app.isMatched = false;
            }).then(function () {
                $location.path('/friends');
            });
        }

        self.current = LocatorService.getNextUser();
        if (angular.isUndefined(self.current)) {
            searchLoop();
        }
    };

    self.Dislike = function () {
        self.current.like = -1;
        self.current = LocatorService.getNextUser();
        if (angular.isUndefined(self.current)) {
            searchLoop();
        }

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
    ['$scope', '$log', '$timeout', '$location', '$modal', 'LocatorService', 'FriendsService', 'UserService', 'ErrorHandler', MainViewController]);
