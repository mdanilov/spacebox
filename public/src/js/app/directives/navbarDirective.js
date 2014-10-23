function navbarDirective ($location, VkService) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            info: '='
        },
        templateUrl: 'src/js/app/templates/navbar.html',
        controller: function ($scope, $log, $location, VkService) {

            this.OpenMain = function () {
                $location.path('/');
            };

            this.OpenFriends = function () {
                $location.path('/friends');
            };

            this.Logout = function () {
                $log.debug('Logout from VK...');
                VkService.asyncLogout().then(function () {
                    $location.path('/login');
                });
            };
        },
        controllerAs: 'navbar',
        link: function (scope, element, attrs) {
            var active = element.find('li.sp-active');
            element.find('.nav.navbar-nav.navbar-left > li').on('click', function () {
                active.removeClass('sp-active');
                active = $(this);
                active.addClass('sp-active');
            });
        }
    };
}

angular.module('spacebox').directive('spNavbar', ['$log', '$location', 'VkService', navbarDirective]);
