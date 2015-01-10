function albumDirective () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            images: '='
        },
        templateUrl: 'src/js/app/templates/widgets/album.html',
        link: function (scope, element, attrs) {
            var imageElements = element.find('.sp-image');

            scope.$watch('images', function () {
                angular.forEach(scope.images, function (image, i) {
                    var element = angular.element(imageElements[i]);
                    if (angular.isElement(element)) {
                        element.css('background-image', 'url(' + image + ')');
                    }
                });
            });
        }
    };
}

angular.module('spacebox').directive('spAlbum',
    [albumDirective]);
