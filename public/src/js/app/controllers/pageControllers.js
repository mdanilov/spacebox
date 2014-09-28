function PageController ($scope, $location, VkService) {

    $scope.users = [];

    VkService.getLoginStatus(function (status) {
        if (status) {
            $location.path('/main');
        }
        else {
            $location.path('/login');
        }
    });
}

function LoginPageController ($scope, $location, VkService) {
    $scope.Login = function () {
        VkService.login(function () {
            $location.path('/main');
        });
    }
}

function MainPageController ($scope, $location, $interval, VkService, GeolocationService, MapService) {

    MapService.invalidateSize();

    function processUsers (error, data) {
        var uids = [];
        for (var i = 0; i < data.length; i++) {
            $scope.users[i].location = data[i].location;
            $scope.users[i].likeStatus = data[i].like ? 'Dislike' : 'Like';
            uids.push(data[i].mid);
        }

        VkService.getUsersInfo(uids, function (error, info) {
            if (!error) {
                for (var i = 0; i < info.length; i++) {
                    $scope.users[i].photoUrl = info.photo_50;
                    $scope.users[i].firstName = info.first_name;
                    $scope.users[i].screenName = info.screen_name;
                    $scope.users[i].uid = info.uid;
                }

                MapService.invalidateUsers();
            }
        })
    }

    function SearchUsers () {
        GeolocationService.getNearUsers(5000, processUsers);
    }

    $interval(SearchUsers, 30000);

    $scope.Search = SearchUsers;

    $scope.Logout = function () {
        VkService.logout(function () {
            $location.path('/login');
        });
    };
}

function ErrorPageController ($scope) {
}

angular.module('spacebox.pageControllers', [])
    .controller('PageController', [$scope, $location, VkService, PageController])
    .controller('LoginPageController', [$scope, $location, VkService, LoginPageController])
    .controller('MainPageController', [$scope, $location, $interval, VkService, GeolocationService, MainPageController])
    .controller('ErrorPageController', [$scope, $location, $interval, ErrorPageController]);
