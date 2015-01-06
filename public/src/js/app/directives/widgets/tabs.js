function tabsDirective ($window, $animate) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            active: '='
        },
        templateUrl: 'src/js/app/templates/widgets/tabs.html',
        link: function (scope, element, attrs) {
            scope.tabs = {
                friends: 'Друзья',
                map: 'Карта'
            };

            var selectElement = element.find('.sp-tabs-select');
            var initialOffset = parseInt(selectElement.css('left'));
            var tabElement = element.find('.sp-tab')[0];
            function openTab (value) {
                var offset = (value == 'map') ?
                    parseInt($window.getComputedStyle(tabElement).getPropertyValue('width')) : 0;
                $animate.animate(selectElement, {}, { left : (initialOffset + offset) + 'px' }).then(function () {
                    scope.$apply(function() {
                        scope.active = value;
                    });
                });
            }

            scope.$watch('active', function (value) {
                openTab(value);
            });

            scope.open = function (value) {
                openTab(value);
            };
        }
    };
}

angular.module('spacebox').directive('spTabs',
    ['$window', '$animate', tabsDirective]);
