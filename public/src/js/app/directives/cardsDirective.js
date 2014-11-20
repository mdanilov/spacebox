function cardsDirective ($window) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            user: '='
        },
        templateUrl: 'src/js/app/templates/cards.html',
        link: function (scope, element, attrs) {
            var cards = element.find('#carousel-example-generic');
            cards.carousel({
                interval: false,
                wrap: true
            });

            scope.Prev = function () {
                cards.carousel('prev');
            };

            scope.Next = function () {
                cards.carousel('next');
            };

            var controls = element.find('.carousel-controls');

            function checkControlsVisibility () {
                if (scope.user && scope.user.hasOwnProperty('photos') &&
                    scope.user.photos.length > 1) {
                    controls.show();
                }
                else {
                    controls.hide();
                }
            }

            var userListener = scope.$watch('user', checkControlsVisibility);
            if ($window.matchMedia("(max-width: 768px)").matches) {
                controls.hide();
                userListener();
            }

            $window.matchMedia("(max-width: 768px)").addListener(function (mediaQueryList) {
                if (mediaQueryList.matches) {
                    controls.hide();
                    userListener();
                }
                else  {
                    checkControlsVisibility();
                    userListener = scope.$watch('user', checkControlsVisibility);
                }
            });
        }
    };
}

angular.module('spacebox').directive('spCards',
    [ '$window', cardsDirective]);
