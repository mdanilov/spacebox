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

    function bootstrapAngular() {
        if (Modernizr.touch) {
            Modernizr.addTest('standalone', window.navigator.standalone);
        }

        // manually bootstrap AngularJS
        angular.module('spacebox').constant('config', config);
        angular.bootstrap(document, ['spacebox'], {strictDi: true});
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
        // load cordova script
        yepnope('cordova.js');

        // load third-party scripts
        yepnope(libraries.development);
        yepnope('lib/modernizr/modernizr.js');

        // load application scripts
        yepnope({
            test: config.DEVELOPMENT,
            yep: [
                'src/js/spacebox-mobile.js',
                'src/css/spacebox.css'
            ],
            nope: [
                'src/js/spacebox-mobile.js',
                'src/css/spacebox.min.css'
            ],
            complete: bootstrapAngular
        });
    }
    else {
        yepnope({
            test: config.DEVELOPMENT,
            yep: libraries.development,
            nope: libraries.production
        });

        yepnope({
            load: 'lib/modernizr/modernizr.js',
            callback: loadApplication
        });

        function loadApplication (url, result, key) {
            if (config.DEVELOPMENT) {
                // load CSS first
                yepnope('dist/spacebox.css');

                // main app script should be loaded first
                yepnope('src/js/app/app.js');

                // load platform dependent scripts
                yepnope({
                    test: Modernizr.touch,
                    yep: 'src/js/app/services/mobile/vkService.js',
                    nope: 'src/js/app/services/vkService.js'
                });

                // load common scripts
                yepnope({
                    load: [
                        /* services */
                        'src/js/app/services/locationService.js',
                        'src/js/app/services/configService.js',
                        'src/js/app/services/likesService.js',
                        'src/js/app/services/friendsService.js',
                        'src/js/app/services/errorHandler.js',
                        'src/js/app/services/locatorService.js',
                        'src/js/app/services/accountService.js',
                        'src/js/app/services/messagesService.js',
                        'src/js/app/services/userService.js',
                        'src/js/app/services/statusService.js',
                        /* controllers */
                        'src/js/app/controllers/applicationController.js',
                        'src/js/app/controllers/propertiesController.js',
                        'src/js/app/controllers/loginController.js',
                        'src/js/app/controllers/errorController.js',
                        'src/js/app/controllers/usersController.js',
                        'src/js/app/controllers/friendsController.js',
                        'src/js/app/controllers/modals/dialogController.js',
                        'src/js/app/controllers/modals/matchController.js',
                        /* filters */
                        'src/js/app/filters/distanceFilter.js',
                        'src/js/app/filters/ageFilter.js',
                        /* directives */
                        'src/js/app/directives/navbar.js',
                        'src/js/app/directives/chat.js',
                        'src/js/app/directives/list.js',
                        'src/js/app/directives/listItem.js',
                        'src/js/app/directives/map.js',
                        'src/js/app/directives/widgets/card.js',
                        'src/js/app/directives/widgets/radar.js',
                        'src/js/app/directives/widgets/album.js',
                        'src/js/app/directives/widgets/status.js',
                        'src/js/app/directives/widgets/tabs.js'
                    ],
                    complete: bootstrapAngular
                });
            }
            else {
                yepnope({
                    test: Modernizr.touch,
                    yep: 'dist/spacebox-mobile.min.js',
                    nope: 'dist/spacebox.min.js',
                    both: 'dist/spacebox.min.css',
                    complete: bootstrapAngular
                });
            }
        }
    }
})();
