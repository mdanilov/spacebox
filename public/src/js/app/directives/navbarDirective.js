function navbarDirective () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'src/js/app/templates/navbar.html'
    };
}

angular.module('spacebox').directive('spNavbar', navbarDirective);
