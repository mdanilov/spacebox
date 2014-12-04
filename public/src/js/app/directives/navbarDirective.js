function navbarDirective ($log, $rootScope, $location, $modal, VkService) {
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

            $rootScope.$on('$locationChangeSuccess', Menu.changeState);

            scope.Logout = function () {
                var dialog = $modal.open({
                    templateUrl: 'src/js/app/templates/modals/dialog.html',
                    windowClass: 'dialog',
                    controller: 'dialogController',
                    size: 'sm',
                    backdrop: 'static'
                });

                dialog.result.then(function () {
                    VkService.asyncLogout().then(function () {
                        $location.path('/login');
                    });
                });
            };
        }
    };
}

angular.module('spacebox').directive('spNavbar',
    ['$log', '$rootScope', '$location', '$modal', 'VkService', navbarDirective]);
