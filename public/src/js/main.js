yepnope({
    test: config.development,
    yep: [
        './lib/mapbox.js/mapbox.uncompressed.css',
        './lib/seiyria-bootstrap-slider/css/bootstrap-slider.css'
    ],
    nope: [
        'https://api.tiles.mapbox.com/mapbox.js/v2.1.1/mapbox.css',
        './lib/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css'
    ]
});

yepnope({
    test: config.development,
    yep: [
        './lib/mapbox.js/mapbox.uncompressed.js',
        './lib/angular/angular.js',
        './lib/angular-route/angular-route.js',
        './lib/angular-touch/angular-touch.js',
        './lib/angular-cookies/angular-cookies.js',
        './lib/angular-animate/angular-animate.js',
        './lib/seiyria-bootstrap-slider/js/bootstrap-slider.js'
    ],
    nope: [
        'https://api.tiles.mapbox.com/mapbox.js/v2.1.1/mapbox.js',
        'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular.min.js',
        'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-route.min.js',
        'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-animate.min.js',
        'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-cookies.min.js',
        'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-touch.min.js',
        './lib/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js'
    ],
    both: [
        'https://vk.com/js/api/openapi.js',
        'https://vk.com/js/api/share.js?90'
    ]
});

function bootstrapAngular () {
    // manually bootstrap AngularJS
    angular.bootstrap(document, ['spacebox']);
}

if (config.development) {
    // css styles
    yepnope([
        './src/css/main.css',
        './src/css/map.css',
        './src/css/navbar.css',
        './src/css/login.css',
        './src/css/modal.css',
        './src/css/user-list.css',
        './src/css/friends.css',
        './src/css/properties.css',
        './src/css/error.css'
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
            './src/js/app/services/meetService.js',
            './src/js/app/services/errorHandler.js',
            './src/js/app/services/locatorService.js',
            './src/js/app/services/userService.js',
            './src/js/app/controllers/applicationController.js',
            './src/js/app/controllers/propertiesController.js',
            './src/js/app/controllers/loginController.js',
            './src/js/app/controllers/errorController.js',
            './src/js/app/controllers/mainController.js',
            './src/js/app/controllers/friendsController.js',
            './src/js/app/controllers/userListItemController.js',
            './src/js/app/filters/distanceFilter.js',
            './src/js/app/filters/meetFilter.js',
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
