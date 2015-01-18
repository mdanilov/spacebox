(function () {

    function readConfig () {
        // default configuration
        var config = {
            CORDOVA: false,
            VERSION: '0.0.0 Development',
            SERVER_URL: undefined,
            DEVELOPMENT: false
        };

        // read configuration from meta tags
        var metas = document.getElementsByTagName('meta');
        for (var i = 0; i < metas.length; ++i) {
            switch (metas[i].getAttribute("name")) {
                case 'development':
                    config.DEVELOPMENT = (metas[i].getAttribute('content') == 'true');
                    break;
                case 'server_url':
                    var url = metas[i].getAttribute('content');
                    if (url.length > 0) {
                        config.SERVER_URL = url;
                    }
                    break;
                case 'version':
                    config.VERSION = metas[i].getAttribute('content');
                    break;
                case 'cordova':
                    config.CORDOVA = (metas[i].getAttribute('content') == 'true');
                    break;
                default:
                    break;
            }
        }

        return config;
    }

    // Application Cache
    var cache = window.applicationCache;
    if (cache) {
        cache.addEventListener('updateready', function (event) {
            var confirm = window.confirm('Доступна новая версия приложения.' +
                ' Чтобы изменения вступили в силу необходимо перезагрузить страницу.');
            if (confirm) {
                location.reload();
            }
        });
    }

    var config = readConfig();
    var libraries = {
        development: [
            /* CSS third-party */
            'lib/bootstrap/dist/css/bootstrap.min.css',
            'lib/components-font-awesome/css/font-awesome.min.css',
            'lib/mapbox.js/mapbox.css',
            'lib/angular-carousel/dist/angular-carousel.min.css',
            'lib/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
            /* JS third-party */
            'lib/modernizr/modernizr.js',
            'lib/moment/min/moment-with-locales.min.js',
            'lib/socket.io-client/socket.io.js',
            'lib/jquery/dist/jquery.js',
            'lib/bootstrap/dist/js/bootstrap.js',
            'lib/mapbox.js/mapbox.uncompressed.js',
            'lib/angular/angular.js',
            'lib/angular-route/angular-route.js',
            'lib/angular-resource/angular-resource.js',
            'lib/angular-touch/angular-touch.js',
            'lib/angular-cookies/angular-cookies.js',
            'lib/angular-animate/angular-animate.js',
            'lib/angular-moment/angular-moment.js',
            'lib/angular-local-storage/dist/angular-local-storage.js',
            'lib/angular-bootstrap/ui-bootstrap.js',
            'lib/angular-bootstrap/ui-bootstrap-tpls.js',
            'lib/angular-carousel/dist/angular-carousel.js',
            'lib/seiyria-bootstrap-slider/js/bootstrap-slider.js',
            /* VK scripts */
            'https://vk.com/js/api/openapi.js',
            'https://vk.com/js/api/share.js?90'
        ],
        production: [
            /* CSS third-party */
            '//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css',
            '//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css',
            '//api.tiles.mapbox.com/mapbox.js/v2.1.3/mapbox.css',
            'lib/angular-carousel/dist/angular-carousel.min.css',
            'lib/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
            /* JS third-party */
            '//code.jquery.com/jquery-2.1.1.min.js',
            '//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js',
            '//api.tiles.mapbox.com/mapbox.js/v2.1.3/mapbox.js',
            '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.8.4/moment-with-locales.min.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.min.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-route.min.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-resource.min.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-animate.min.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-cookies.min.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-touch.min.js',
            '//cdn.socket.io/socket.io-1.2.1.js',
            'lib/modernizr/modernizr.js',
            'lib/angular-local-storage/dist/angular-local-storage.min.js',
            'lib/angular-moment/angular-moment.min.js',
            'lib/angular-bootstrap/ui-bootstrap.min.js',
            'lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'lib/angular-carousel/dist/angular-carousel.min.js',
            'lib/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
            /* VK scripts */
            'https://vk.com/js/api/openapi.js',
            'https://vk.com/js/api/share.js?90'
        ]
    };

    if (config.CORDOVA) {
        yepnope({
            load: [ 'cordova.js', libraries.development ],
            complete: loadApplication
        });
    }
    else {
        yepnope({
            test: config.DEVELOPMENT,
            yep: libraries.development,
            nope: libraries.production,
            complete: loadApplication
        });
    }

    function loadApplication () {
        yepnope({
            test: config.DEVELOPMENT,
            yep: [ 'dist/spacebox.js', 'dist/spacebox.css' ],
            nope: [ 'dist/spacebox.min.js', 'dist/spacebox.min.css' ],
            complete: bootstrapAngular
        });

        function bootstrapAngular () {
            if (Modernizr.touch) {
                Modernizr.addTest('standalone', window.navigator.standalone);
            }

            // manually bootstrap AngularJS
            angular.module('spacebox').constant('config', config);
            angular.bootstrap(document, ['spacebox'], {strictDi: true});
        }
    }
})();
