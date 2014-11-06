function radarDirective () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            image: '=',
            status: '='
        },
        templateUrl: 'src/js/app/templates/radar.html',
        link: function (scope, element, attrs) {
            scope.messages = {
                'search': "Идет поиск новых пользователей...",
                'done': "Рядом с вами нет новых пользователей."
            };

            function addCircle() {
                var circle = $('<div class="circle"></div>');
                element.find('#spRadar').append(circle);
                circle.animate({
                    'width': '400px',
                    'height': '400px',
                    'margin-top': '-200px',
                    'margin-left': '-200px',
                    'opacity': '0'
                }, 5000, 'linear');

                setTimeout(function __remove() {
                    circle.remove();
                }, 5000);
            }

            addCircle();
            setInterval(addCircle, 3000);

            element.find('#spShareButton').append(
                VK.Share.button(false, {
                    type: "round",
                    text: "Рассказать друзьям"
            }));

            scope.ClickOnImage = function () {
                addCircle();
            }
        }
    };
}

angular.module('spacebox').directive('spRadar',
    [radarDirective]);