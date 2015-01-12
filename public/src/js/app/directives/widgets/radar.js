function radarDirective ($animate, $interval) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            image: '='
        },
        template: '<img class="sp-radar-image" ng-src="{{image}}" ng-click="click()">',
        link: function (scope, element, attrs) {

            function circleAnimation (callback) {
                if (element.length > 0) {
                    var circle = angular.element('<div class="sp-radar-circle"></div>');
                    element.append(circle);
                    $animate.leave(circle).then(callback);
                }
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

            scope.click = function () {
                circleAnimation();
            };

            scope.$on('destroy', function () {
                $interval.cancel(interval);
            });
        }
    };
}

angular.module('spacebox').directive('spRadar',
    ['$animate', '$interval', radarDirective]);