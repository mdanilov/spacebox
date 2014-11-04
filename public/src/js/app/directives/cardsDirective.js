function cardsDirective () {
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
                interval: 4000,
                wrap: true
            });

            scope.Prev = function () {
                cards.carousel('prev');
            };

            scope.Next = function () {
                cards.carousel('next');
            };

            var controls = element.find('.carousel-controls');
            scope.$watch('user.photos', function () {
                if (scope.user.photos &&
                    scope.user.photos.length > 1) {
                    controls.show();
                }
                else {
                    controls.hide();
                }
            });
        }
    };
}

angular.module('spacebox').directive('spCards', cardsDirective);
