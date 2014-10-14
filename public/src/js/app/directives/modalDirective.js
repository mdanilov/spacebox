function modalDirective () {
    return {
        restrict: 'E',
        transclude: false,
        replace: true,
        scope: {
            images: '@',
            toggle: '='
        },
        templateUrl: 'src/js/app/templates/modal.html',
        link: function ($scope, element, attrs) {
            element.modal({show: false});
            $scope.$watch('toggle', function (value) {
                if (value != null) {
                    element.modal('toggle');
                }
            });
        }
    };
}

angular.module('spacebox').directive('spaceboxModal', modalDirective);
