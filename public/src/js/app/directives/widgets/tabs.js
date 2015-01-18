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
            scope.active = 'friends';

            var selectElement = element.find('.sp-tabs-select');
            var initialOffset = parseInt(selectElement.css('left'));
            var tabElement = element.find('.sp-tab')[0];

            function openTab (value) {
                if (!scope.tabs.hasOwnProperty(value)) {
                    return;
                }

                var leftToRight = (value == 'map');
                var offset = parseInt($window.getComputedStyle(tabElement).getPropertyValue('width'));
                var to = leftToRight ? {left: (initialOffset + offset) + 'px'} :
                    {right: (initialOffset + offset) + 'px'};
                $animate.animate(selectElement, {}, to).then(function () {
                    var properties = leftToRight ? {left: 'initial', right: initialOffset} :
                        {left: initialOffset, right: 'initial'};
                    selectElement.css(properties);
                    scope.$apply(function () {
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
