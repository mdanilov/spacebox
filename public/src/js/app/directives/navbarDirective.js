function navbarDirective ($log, $rootScope, $location, $window, VkService) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            info: '='
        },
        templateUrl: 'src/js/app/templates/navbar.html',
        link: function (scope, element, attrs) {
            var Menu = (function () {
                var _active = element.find("a[href='#" + $location.path() + "']").parent();
                _active.addClass('sp-active');
                return {
                    changeState: function () {
                        if (_active) {
                            _active.removeClass('sp-active');
                        }
                        _active = element.find("a[href='#" + $location.path() + "']").parent();
                        _active.addClass('sp-active');
                    }
                };
            })();

            $window.matchMedia("(max-width: 768px)").addListener(function (mediaQueryList) {
                if (mediaQueryList.matches) {
                }
                else  {

                }
            });

            $rootScope.$on('$locationChangeSuccess', Menu.changeState);

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
    ['$log', '$rootScope', '$location', '$window', 'VkService', navbarDirective]);
