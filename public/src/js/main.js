﻿(function () {

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
        // manually bootstrap AngularJS
        angular.module('spacebox').constant('config', config);
        angular.bootstrap(document, ['spacebox']);
    }

    var config = readConfig();
    var libraries = {
        development: [
            /* CSS third-party */
            'lib/bootstrap/dist/css/bootstrap.css',
            'lib/components-font-awesome/css/font-awesome.css',
            'lib/mapbox.js/mapbox.uncompressed.css',
            'lib/angular-carousel/dist/angular-carousel.css',
            'lib/seiyria-bootstrap-slider/css/bootstrap-slider.css',
            /* JS third-party */
            'lib/moment/moment.js',
            'lib/socket.io-client/socket.io.js',
            'lib/moment/locale/ru.js',
            'lib/jquery/dist/jquery.js',
            'lib/bootstrap/dist/js/bootstrap.js',
            'lib/mapbox.js/mapbox.uncompressed.js',
            'lib/leaflet.locatecontrol/src/L.Control.Locate.js',
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
            '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.8.4/moment.min.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular.min.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-route.min.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-resource.min.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-animate.min.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-cookies.min.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-touch.min.js',
            '//cdn.socket.io/socket.io-1.2.1.js',
            'lib/angular-local-storage/dist/angular-local-storage.min.js',
            'lib/angular-moment/angular-moment.min.js',
            'lib/angular-bootstrap/ui-bootstrap.min.js',
            'lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'lib/leaflet.locatecontrol/dist/L.Control.Locate.min.js',
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

        // load application scripts
        yepnope({
            test: config.DEVELOPMENT,
            yep: [
                'src/js/spacebox-mobile.js',
                'src/css/spacebox.css'
            ],
            nope: [
                'src/js/spacebox-mobile.min.js',
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
                yepnope([
                    'src/css/main.css',
                    'src/css/map/map.css',
                    'src/css/map/leaflet.css',
                    'src/css/views/login.css',
                    'src/css/views/main.css',
                    'src/css/views/properties.css',
                    'src/css/views/error.css',
                    'src/css/views/friends.css',
                    'src/css/modals/dialog.css',
                    'src/css/modals/match.css',
                    'src/css/partials/radar.css',
                    'src/css/partials/navbar.css',
                    'src/css/partials/chat.css',
                    'src/css/partials/friend-list.css',
                    'src/css/partials/cards.css',
                    'src/css/partials/controls.css'
                ]);

                // main app script should be loaded first
                yepnope('src/js/app/app.js');

                // load platform dependent scripts
                yepnope({
                    test: Modernizr.touch,
                    yep: 'src/js/app/services/mobile/vkService.js',
                    nope: 'src/js/app/services/vkService.js'
                });

                if (Modernizr.touch) {
                    // TODO: disable scrolling on iPhone
                    //var firstMove;
                    //window.addEventListener('touchstart', function () {
                    //    firstMove = true;
                    //});
                    //window.addEventListener('touchmove', function (event) {
                    //    if (firstMove) {
                    //        event.preventDefault();
                    //        firstMove = false;
                    //    }
                    //});
                }

                // load common scripts
                yepnope({
                    load: [
                        'src/js/app/services/locationService.js',
                        'src/js/app/services/configService.js',
                        'src/js/app/services/mapService.js',
                        'src/js/app/services/likesService.js',
                        'src/js/app/services/friendsService.js',
                        'src/js/app/services/errorHandler.js',
                        'src/js/app/services/locatorService.js',
                        'src/js/app/services/accountService.js',
                        'src/js/app/services/messagesService.js',
                        'src/js/app/services/userService.js',
                        'src/js/app/services/statusService.js',
                        'src/js/app/controllers/applicationController.js',
                        'src/js/app/controllers/propertiesController.js',
                        'src/js/app/controllers/loginController.js',
                        'src/js/app/controllers/errorController.js',
                        'src/js/app/controllers/mainController.js',
                        'src/js/app/controllers/friendsController.js',
                        'src/js/app/controllers/modals/dialogController.js',
                        'src/js/app/controllers/modals/matchController.js',
                        'src/js/app/filters/distanceFilter.js',
                        'src/js/app/filters/ageFilter.js',
                        'src/js/app/directives/navbarDirective.js',
                        'src/js/app/directives/chatDirective.js',
                        'src/js/app/directives/cardsDirective.js',
                        'src/js/app/directives/friendListDirective.js',
                        'src/js/app/directives/friendListItemDirective.js',
                        'src/js/app/directives/widgets/radar.js'
                    ],
                    complete: bootstrapAngular
                });
            }
            else {
                yepnope({
                    test: Modernizr.touch,
                    yep: 'dist/spacebox-mobile.js',
                    nope: 'dist/spacebox.js',
                    both: 'dist/spacebox.min.css',
                    complete: bootstrapAngular
                });
            }
        }
    }
})();
