function PageController ($scope, $log, $state, VkMobileService) {

    $log.debug('Initialize page controller...');

    $scope.users = [];

    VkMobileService.getLoginStatus(function (error, status) {
        if (error) {
            $log.error('Force to login page due to login status error: ', error);
            return;
        }

        if (status) {
            $log.debug('Force to main page, user already authorized');
            $state.go('tab.map');
        }
        else {
            $log.debug('Load login page, user is not authorized');
            $state.go('tab.login');
        }
    });
}

function LoginPageController ($scope, $state, $log, $window, VkMobileService) {
    $window.alert('Login');
    $log.debug('Initialize login page controller...');
    
    $scope.Login = function (e) {
    	e.preventDefault();
    	$log.debug('Login to VK...');
        VkMobileService.login(function () {
            $state.go('tab.map');
        });
    }
}

function MapPageController ($scope, $state, $log, VkMobileService, GeolocationService, MapService) {

    $log.debug('Initialize map page controller...');

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
            users[i].likeStatus = data[i].like ? 'Dislike' : 'Like';
            users[i].photoUrl = info[i].photo_50;
            users[i].firstName = info[i].first_name;
            users[i].screenName = info[i].screen_name;
            users[i].uid = info[i].uid;
        }

        $scope.users = users;
        //$scope.$apply();
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

        VkMobileService.getUsersInfo(uids, function (error, info) {
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

    $scope.Search = function (e) {
        e.preventDefault();
        SearchUsers();
    };

    $scope.Logout = function (e) {
        e.preventDefault();
        $log.debug('Logout from VK...');
        VkMobileService.logout(function () {
            $location.path('/login');
        });
    };
}

angular.module('spacebox-mobile')
.controller('PageController',
    ['$scope', '$log', '$state', 'VkMobileService', PageController])    
.controller('LoginPageController', 
	['$scope', '$state', '$log', '$window', 'VkMobileService', LoginPageController])
.controller('MapPageController',
    ['$scope', '$state', '$log', 'VkMobileService', 'GeolocationService', 'MapService', MapPageController])

// .controller('MapCtrl', function($scope) {
// 	Map.init();
// 	Map.invalidate();
// 	Model.init();
// 	Model.update();
// })

.controller('FriendsCtrl', ['$scope', '$log', function($scope, $log) {
	$log.debug('FriendsCtrl...');
	$log.debug('$scope.users = ', $scope.users);
	$log.debug('$scope.$parent.users = ', $scope.$parent.users);
}])

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
});

