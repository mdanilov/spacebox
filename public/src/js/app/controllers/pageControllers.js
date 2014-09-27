var pageControllers = angular.module('pageControllers', []);

pageControllers.controller('PageController', [$scope, $location,
    function ($scope, $location) {
        vk.getLoginStatus(function (status) {
            if (status) {
                $location.path('/main');
            }
            else {
                $location.path('/login');
            }
        });
    }]);

pageControllers.controller('LoginPageController', [$scope, $location,
    function ($scope, $location) {
        $scope.Login = function () {
            vk.login(function () {
                $location.path('/main');
            });
        }
    }]);

pageControllers.controller('MainPageController', [$scope, $location, $interval,
    function ($scope, $location, $interval) {

        Map.invalidate();
        $interval(Model.update, 30000);

        $scope.Search = function () {
            Model.update();
        };

        $scope.Logout = function () {
            vk.logout(function () {
                $location.path('/login');
            });
        };
    }]);

pageControllers.controller('ErrorPageController', function ($scope) {
});
