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

            function circleAnimation (callback) {
                var circle = angular.element('<div class="sp-radar-circle"></div>');
                element.append(circle);
                $animate.leave(circle, callback);
            }

            var circleCount = 0;
            circleAnimation();
            var interval = $interval(function () {
                if (circleCount < 2) {
                    ++circleCount;
                    circleAnimation(function () {
                        --circleCount;
                    });
                }
            }, 2000);

            var shareButtonHtml = '<div class="btn btn-primary">' +
                '<i class="fa fa-tint"></i><span>Рассказать друзьям!</span></div>';
            element.find('#spShareButton').append(VkService.getShareButtonWidget(shareButtonHtml));

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