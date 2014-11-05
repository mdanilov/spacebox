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
            function addCircle() {
                var $circle = $('<div class="circle"></div>');
                $circle.animate({
                    'width': '400px',
                    'height': '400px',
                    'margin-top': '-200px',
                    'margin-left': '-200px',
                    'opacity': '0'
                }, 6000, 'swing');
                element.find('#spRadar').append($circle);
            
                setTimeout(function __remove() {
                    $circle.remove();
                }, 6000);
            }
            addCircle();
            setInterval(addCircle, 2000);
            element.find('#spShareButton').append(VK.Share.button(false,{type: "round", text: "Рассказать друзьям"}));
        }
    };
}

angular.module('spacebox').directive('spRadar',
    [radarDirective]);