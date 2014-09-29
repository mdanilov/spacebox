angular.module('spacebox-mobile.controllers', [])

.controller('LoginCtrl', function($scope, $state, $window) {
	angular.element(document).ready(function () {
        console.log('Document ready');
        $scope.clickLogin = function() {   
	        vk.login(function () {  	
				$state.go('tab.map'); 
	        });
		};
		$window.alert('Document ready');
    });
})

.controller('MapCtrl', function($scope) {
	Map.init();
	Map.invalidate();
	Model.init();
	Model.update();
});

.controller('FriendsCtrl', function($scope, Friends) {
   	Model.update();

	$scope.friends = Model.getUsers();
    //$scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

