function bootstrapAngular() {
    // manually bootstrap AngularJS
    angular.bootstrap(document, ['spacebox']);
}

if (CONFIG.CORDOVA) {
    yepnope([
        './lib/bootstrap/dist/css/bootstrap.css',
        './lib/components-font-awesome/css/font-awesome.css',
        './lib/mapbox.js/mapbox.uncompressed.css',
        './lib/moment/moment.js',
        './lib/moment/locale/ru.js',
        './lib/angular-carousel/dist/angular-carousel.css',
        './lib/seiyria-bootstrap-slider/css/bootstrap-slider.css',
        './lib/jquery/dist/jquery.js',
        './lib/bootstrap/dist/js/bootstrap.js',
        './lib/mapbox.js/mapbox.uncompressed.js',
        './lib/leaflet.locatecontrol/src/L.Control.Locate.js',
        './lib/angular/angular.js',
        './lib/angular-route/angular-route.js',
        './lib/angular-touch/angular-touch.js',
        './lib/angular-cookies/angular-cookies.js',
        './lib/angular-animate/angular-animate.js',
        './lib/angular-moment/angular-moment.js',
        './lib/angular-carousel/dist/angular-carousel.js',
        './lib/seiyria-bootstrap-slider/js/bootstrap-slider.js',
        'https://vk.com/js/api/openapi.js',
        'https://vk.com/js/api/share.js?90'
    ]);

    yepnope({
        test: CONFIG.DEVELOPMENT,
        yep: [
            './dist/spacebox-mobile.js',
            './dist/spacebox.css'
        ],
        nope: [
            './dist/spacebox-mobile.min.js',
            './dist/spacebox.min.css'
        ],
        complete: bootstrapAngular
    });
}
else {
    yepnope({
        test: CONFIG.DEVELOPMENT,
        yep: [
            './lib/bootstrap/dist/css/bootstrap.css',
            './lib/components-font-awesome/css/font-awesome.css',
            './lib/mapbox.js/mapbox.uncompressed.css',
            './lib/angular-carousel/dist/angular-carousel.css',
            './lib/seiyria-bootstrap-slider/css/bootstrap-slider.css'
        ],
        nope: [
            '//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css',
            '//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css',
            '//api.tiles.mapbox.com/mapbox.js/v2.1.3/mapbox.css',
            './lib/angular-carousel/dist/angular-carousel.min.css',
            './lib/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css'
        ]
    });

    yepnope({
        test: CONFIG.DEVELOPMENT,
        yep: [
            './lib/jquery/dist/jquery.js',
            './lib/bootstrap/dist/js/bootstrap.js',
            './lib/mapbox.js/mapbox.uncompressed.js',
            './lib/leaflet.locatecontrol/src/L.Control.Locate.js',
            './lib/moment/moment.js',
            './lib/moment/locale/ru.js',
            './lib/angular/angular.js',
            './lib/angular-route/angular-route.js',
            './lib/angular-touch/angular-touch.js',
            './lib/angular-cookies/angular-cookies.js',
            './lib/angular-animate/angular-animate.js',
            './lib/angular-carousel/dist/angular-carousel.js',
            './lib/angular-moment/angular-moment.js',
            './lib/seiyria-bootstrap-slider/js/bootstrap-slider.js'
        ],
        nope: [
            '//code.jquery.com/jquery-2.1.1.min.js',
            '//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js',
            '//api.tiles.mapbox.com/mapbox.js/v2.1.3/mapbox.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular.min.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-route.min.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-animate.min.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-cookies.min.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-touch.min.js',
            '//cdnjs.cloudflare.com/ajax/libs/angular-moment/0.8.0/angular-moment.min.js',
            './lib/leaflet.locatecontrol/dist/L.Control.Locate.min.js',
            './lib/angular-carousel/dist/angular-carousel.min.js',
            './lib/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js'
        ],
        both: [
            '//vk.com/js/api/openapi.js',
            '//vk.com/js/api/share.js?90'
        ]
    });

    yepnope({
        load: './lib/modernizr/modernizr.js',
        callback: loadApplication
    });

    function loadApplication (url, result, key) {
        if (CONFIG.DEVELOPMENT) {
            // css styles
            yepnope([
                './src/css/main.css',
                './src/css/map/map.css',
                './src/css/views/login.css',
                './src/css/views/properties.css',
                './src/css/views/error.css',
                './src/css/views/friends.css',
                './src/css/partials/navbar.css',
                './src/css/partials/modal.css',
                './src/css/partials/friend-list.css',
                './src/css/partials/cards.css',
                './src/css/partials/controls.css'
            ]);

            // main app script should be loaded first
            yepnope('./src/js/app/app.js');

            // platform dependent scripts
            yepnope({
                test: Modernizr.touch,
                yep: './src/js/app/services/mobile/vkService.js',
                nope: './src/js/app/services/vkService.js'
            });

            // common scripts
            yepnope({
                load: [
                    './src/js/app/services/geolocationService.js',
                    './src/js/app/services/configService.js',
                    './src/js/app/services/mapService.js',
                    './src/js/app/services/friendsService.js',
                    './src/js/app/services/errorHandler.js',
                    './src/js/app/services/locatorService.js',
                    './src/js/app/services/userService.js',
                    './src/js/app/services/statusService.js',
                    './src/js/app/controllers/applicationController.js',
                    './src/js/app/controllers/propertiesController.js',
                    './src/js/app/controllers/loginController.js',
                    './src/js/app/controllers/errorController.js',
                    './src/js/app/controllers/mainController.js',
                    './src/js/app/controllers/friendsController.js',
                    './src/js/app/controllers/userListItemController.js',
                    './src/js/app/filters/distanceFilter.js',
                    './src/js/app/filters/ageFilter.js',
                    './src/js/app/directives/navbarDirective.js',
                    './src/js/app/directives/cardsDirective.js',
                    './src/js/app/directives/modalDirective.js',
                    './src/js/app/directives/friendListDirective.js',
                    './src/js/app/directives/friendListItemDirective.js',
                    './src/js/app/directives/radarDirective.js'
                ],
                complete: bootstrapAngular
            });
        }
        else {
            yepnope({
                test: Modernizr.touch,
                yep: './dist/spacebox-mobile.min.js',
                nope: './dist/spacebox.min.js',
                both: './dist/spacebox.min.css',
                complete: bootstrapAngular
            });
        }
    }
}
