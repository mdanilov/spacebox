function cardsDirective () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            user: '='
        },
        templateUrl: 'src/js/app/templates/cards.html',
        link: function (scope, element, attrs) {
            scope.$watch('user', function () {
                scope.carouselIndex = 0;
            });
        }
    };
}

angular.module('spacebox').directive('spCards',
    [cardsDirective]);
