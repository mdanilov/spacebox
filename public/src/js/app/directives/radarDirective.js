function radarDirective ($animate, $interval, VkService) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            image: '=',
            status: '='
        },
        templateUrl: 'src/js/app/templates/radar.html',
        link: function (scope, element, attrs) {
            scope.messages = {
                'search': "Идет поиск новых пользователей...",
                'done': "Рядом с вами нет новых пользователей."
            };

            function circleAnimation () {
                var circle = angular.element('<div class="sp-radar-circle"></div>');
                element.append(circle);
                $animate.leave(circle);
            }

            circleAnimation();
            var interval = $interval(circleAnimation, 2000);

            element.find('#spShareButton').append(VkService.getShareButtonWidget());

            scope.ClickOnImage = function () {
                circleAnimation();
            };

            scope.$on('destroy', function () {
                $interval.cancel(interval);
            });
        }
    };
}

angular.module('spacebox').directive('spRadar',
    ['$animate', '$interval', 'VkService', radarDirective]);