function navbarDirective ($log, $rootScope, $location, VkService) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            info: '='
        },
        templateUrl: 'src/js/app/templates/navbar.html',
        link: function (scope, element, attrs) {
            function hashSelector () {
                return "a[href='#" + $location.path() + "']";
            }

            var active = element.find(hashSelector()).parent();
            active.addClass('sp-active');

            $rootScope.$on('$locationChangeSuccess', function ($event) {
                active.removeClass('sp-active');
                active = element.find(hashSelector()).parent();
                active.addClass('sp-active');
            });

            scope.Logout = function () {
                $log.debug('Logout from VK...');
                VkService.asyncLogout().then(function () {
                    $location.path('/login');
                });
            };
        }
    };
}

angular.module('spacebox').directive('spNavbar',
    ['$log', '$rootScope', '$location', 'VkService', navbarDirective]);
