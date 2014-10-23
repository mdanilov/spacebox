function UserListItemController ($scope, $window, VkService, MeetService) {

    $scope.openVkProfile = function () {
        var url = 'http://vk.com/' + $scope.user.screenName;
        $window.open(url);
    };

    $scope.toggleLike = function () {
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

    $scope.openLightboxModal = function (user) {
        VkService.getPhotos(user.uid, function (error, urls) {
            if (error) {
                return;
            }

            $scope.main.images = urls[0];
            $scope.main.toggleModal = !$scope.main.toggleModal;
            $scope.$apply();
        });
    };
}

angular.module('spacebox')
    .controller('UserListItemController',
        ['$scope', '$window', 'VkService', 'MapService', 'MeetService', UserListItemController]);
