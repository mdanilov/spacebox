function PageController ($scope, $location, VkService) {

    $scope.users = [];

    VkService.getLoginStatus(function (error) {
        if (!error) {
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
            $scope.users[i] = {};
            $scope.users[i].location = {
                latitude: data[i].latitude,
                longitude: data[i].longitude
            };
            $scope.users[i].likeStatus = data[i].like ? 'Dislike' : 'Like';
            uids.push(data[i].mid);
        }

        VkService.getUsersInfo(uids, function (error, info) {
            if (!error) {
                for (var i = 0; i < info.length; i++) {
                    $scope.users[i].photoUrl = info[i].photo_50;
                    $scope.users[i].firstName = info[i].first_name;
                    $scope.users[i].screenName = info[i].screen_name;
                    $scope.users[i].uid = info[i].uid;
                }

                MapService.invalidateSize();
                MapService.invalidateUsers($scope.users);
            }
        })
    }

    function SearchUsers () {
        GeolocationService.getNearUsers(5000, processUsers);
    }

    $scope.Search = function (e) {
        e.preventDefault();
        SearchUsers();
    };

    $scope.Logout = function (e) {
        e.preventDefault();
        VkService.logout(function () {
            $location.path('/login');
        });
    };
}

function ErrorPageController ($scope) {
}

angular.module('spacebox.pages', [])
    .controller('PageController',
        ['$scope', '$location', 'VkService', PageController])
    .controller('LoginPageController',
        ['$scope', '$location', 'VkService', LoginPageController])
    .controller('MainPageController',
        ['$scope', '$location', '$interval', 'VkService', 'GeolocationService', 'MapService', MainPageController])
    .controller('ErrorPageController',
        ['$scope', '$location', '$interval', ErrorPageController]);
