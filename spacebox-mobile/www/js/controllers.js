angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $state, $window) {
	loadPageScripts('loginPage');
	angular.element(document).ready(function () {
        console.log('Document ready');
        $scope.clickLogin = function() {   
	        vk.login(function () {
	    		//$window.alert('in callback');    	
				$state.go('tab.account'); //navigation.go('mainPage');
	        });
		};
		$window.alert('Document ready');
    });
})

.controller('FriendsCtrl', function($scope, Friends) {
   	loadPageScripts('listPage', function() {
   		Model.update();
   	});
	$scope.friends = Model.getUsers();
    //$scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
	loadPageScripts('mainPage', function() {
		Map.init();
		Map.invalidate();
		Model.init();
		Model.update();
	});
});
