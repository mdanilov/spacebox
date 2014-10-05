function UserListItemController ($scope, $window, $modal, MapService, MeetService) {

    $scope.btnGroupIsHidden = true;

    $scope.gainFocus = function (e) {
        e.preventDefault();
        $scope.btnGroupIsHidden = false;
    };

    $scope.onClick = function (e) {
        e.preventDefault();
        MapService.setCenter($scope.user.location);
    };

    $scope.loseFocus = function (e) {
        e.preventDefault();
        $scope.btnGroupIsHidden = true;
    };

    $scope.openVkProfile = function () {
        var url = 'http://vk.com/' + $scope.user.screenName;
        $window.open(url);
    };

    $scope.toggleLike = function (e) {
        e.preventDefault();
        if ($scope.user.like) {
            $scope.user.like = false;
            MeetService.dislike($scope.user.uid, function (error) {
                if (error) {
                    $scope.user.like = true;
                }
            });
        }
        else {
            $scope.user.like = true;
            MeetService.like($scope.user.uid, function (error) {
                if (error) {
                    $scope.user.like = false;
                }
            });
        }
    };

    $scope.openModal = function () {
        $modal.open({
            templateUrl: 'src/js/app/templates/modal.html',
            controller: 'ModalController',
            size: 'lg',
            scope: $scope
        });
    };
}

angular.module('spacebox')
    .controller('UserListItemController',
    ['$scope', '$window', '$modal', 'MapService', 'MeetService', UserListItemController]);
