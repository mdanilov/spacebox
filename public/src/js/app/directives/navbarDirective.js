function navbarDirective ($log, $rootScope, $location, $modal, VkService) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            info: '='
        },
        templateUrl: 'src/js/app/templates/navbar.html',
        link: function (scope, element, attrs) {
            var active = element.find("a[href='#" + $location.path() + "']").parent();
            active.addClass('sp-active');

            $rootScope.$on('$locationChangeSuccess', function () {
                if (active) {
                    active.removeClass('sp-active');
                }
                active = element.find("a[href='#" + $location.path() + "']").parent();
                active.addClass('sp-active');
            });

            scope.text = {
                title: 'Вы действительно хотите выйти?',
                description: 'Вас по-прежнему смогут видеть в вашей последней известной локации.',
                cancel: 'Отмена',
                ok: 'Выйти'
            };

            scope.Logout = function () {
                var dialog = $modal.open({
                    templateUrl: 'src/js/app/templates/modals/dialog.html',
                    windowClass: 'dialog',
                    controller: 'DialogController',
                    resolve: {
                        text: function () {
                            return scope.text;
                        }
                    },
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
