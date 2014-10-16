function navbarDirective ($location, VkService) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            user: '='
        },
        templateUrl: 'src/js/app/templates/navbar.html',
        link: function (scope, element, attrs) {
            var active = element.find('nav.navbar-nav li:first-child');
            element.find('nav.navbar-nav li').on('click', function () {
                active.removeClass('sp-active');
                active = $(this);
                active.addClass('sp-active');
            });

            scope.OpenMain = function () {
                $location.path('/');
            };

            scope.OpenFriends = function () {
                $location.path('/friends');
            };

            scope.Logout = function () {
                $log.debug('Logout from VK...');
                VkService.logout(function () {
                    $location.path('/login');
                });
            };
        }
    };
}

angular.module('spacebox').directive('spNavbar', ['$location', 'VkService', navbarDirective]);
