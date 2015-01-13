function statusDirective (ConfigService) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            status: '='
        },
        templateUrl: 'src/js/app/templates/widgets/status.html',
        link: function (scope, element, attrs) {
            var MAX_LENGTH = ConfigService.MAX_STATUS_LENGTH;
            scope.length = MAX_LENGTH;

            scope.$watch('status', function (value) {
                if (angular.isString(value)) {
                    scope.text = value;
                    scope.length = MAX_LENGTH - value.length;
                }
            });

            scope.onChange = function () {
                if (scope.text.length > MAX_LENGTH) {
                    scope.length = 0;
                    scope.text = scope.text.substring(0, MAX_LENGTH);
                }
                else {
                    scope.length = MAX_LENGTH - scope.text.length;
                }

                scope.status = scope.text;
            };
        }
    };
}

angular.module('spacebox').directive('spStatus',
    ['ConfigService', statusDirective]);