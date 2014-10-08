function navigationDirective () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'src/js/app/templates/navigation.html'
    };
}

angular.module('spacebox').directive('spaceboxNavigation', navigationDirective);
