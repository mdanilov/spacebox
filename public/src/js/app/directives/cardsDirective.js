function cardsDirective (VkService) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            user: '='
        },
        templateUrl: 'src/js/app/templates/cards.html',
        link: function (scope, element, attrs) {
            scope.images = [];
            scope.$watch('user', function (value) {
                if (value && value.hasOwnProperty('mid')) {
                    VkService.asyncGetPhotos(scope.user.mid).then(function (data) {
                        scope.images = data;
                    });
                }
                else {
                    scope.images = [];
                }
            });
        }
    };
}

angular.module('spacebox').directive('spCards',
    ['VkService', cardsDirective]);
