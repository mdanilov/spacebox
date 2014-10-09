function LoginPageController ($scope, $log, $location, VkService, ConfigService) {

    $log.debug('Initialize login page controller...');

    $scope.Login = function (e) {
        e.preventDefault();
        $log.debug('Try login to VK...');
        VkService.login(function (error) {
            if (!error) {
                ConfigService.isAuthorized = true;
                $location.path('/');
            }
        });
    }
}

function MainPageController ($scope, $location, $log, VkService, GeolocationService, MapService) {

    $log.debug('Initialize main page controller...');

    MapService.init();
    SearchUsers();

    function CreateUserList (data, info) {

        var users = [];
        for (var i = 0; i < info.length; i++) {
            users[i] = {};
            users[i].location = {
                latitude: data[i].latitude,
                longitude: data[i].longitude
            };
            users[i].distance = data[i].distance;
            users[i].like = data[i].like;
            users[i].liked = data[i].likeMe;
            users[i].bdate = info[i].bdate;
            users[i].photoUrl = info[i].photo_50;
            users[i].largePhotoUrl = info[i].photo_100;
            users[i].firstName = info[i].first_name;
            users[i].screenName = info[i].screen_name;
            users[i].uid = info[i].uid;
        }

        $scope.users = users;
        $scope.$apply();
    }

    function processNearUsers (error, data) {
        if (error) {
            $log.error('Can\'t get near users due to error: ', error);
            return;
        }

        $log.debug('Founded near users locations: ', data);
        var uids = [];
        for (var i = 0; i < data.length; i++) {
            uids.push(data[i].mid);
        }

        VkService.getUsersInfo(uids, function (error, info) {
            if (error) {
                $log.error('Can\'t get VK users info due to error: ', error);
                return;
            }

            $log.debug('VK users info collected: ', info);
            CreateUserList(data, info);
            MapService.invalidateSize();
            MapService.invalidateUsers($scope.users);
        })
    }

    function SearchUsers () {
        $log.debug('Try to search near users...');
        GeolocationService.getNearUsers(15000, processNearUsers);
    }

    $scope.Search = function () {
        SearchUsers();
    };

    $scope.Logout = function () {
        $log.debug('Logout from VK...');
        VkService.logout(function () {
            $location.path('/login');
        });
    };
}

function ErrorPageController ($scope) {
}

angular.module('spacebox')
    .controller('LoginPageController',
        ['$scope', '$log', '$location', 'VkService', 'ConfigService', LoginPageController])
    .controller('MainPageController',
        ['$scope', '$location', '$log', 'VkService', 'GeolocationService', 'MapService', MainPageController])
    .controller('ErrorPageController',
        ['$scope', '$location', '$interval', ErrorPageController]);
