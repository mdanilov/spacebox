angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $window) {
	angular.element(document).ready(function () {
        console.log('Document ready');
	    $scope.clickLogin = function() {   
	        vk.login(function () {
	        	navigation.go('mainPage');
	        });
		};
		$window.alert('Document ready');
    });
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
});
