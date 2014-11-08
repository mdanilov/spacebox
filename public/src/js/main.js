yepnope({
    test: config.development,
    yep: [
        './lib/mapbox.js/mapbox.uncompressed.css'
    ],
    nope: [
        'https://api.tiles.mapbox.com/mapbox.js/v2.1.1/mapbox.css'
    ]
});

yepnope({
    test: config.development,
    yep: [
        './lib/mapbox.js/mapbox.uncompressed.js',
        './lib/leaflet.locatecontrol/src/L.Control.Locate.js',
        './lib/angular/angular.js',
        './lib/angular-route/angular-route.js',
        './lib/angular-touch/angular-touch.js',
        './lib/angular-cookies/angular-cookies.js',
        './lib/angular-animate/angular-animate.js'
    ],
    nope: [
        'https://api.tiles.mapbox.com/mapbox.js/v2.1.1/mapbox.js',
        'https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-locatecontrol/v0.30.0/L.Control.Locate.js',
        'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular.min.js',
        'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-route.min.js',
        'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-animate.min.js',
        'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-cookies.min.js',
        'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-touch.min.js'
    ],
    both: [
        'https://vk.com/js/api/openapi.js',
        'http://vk.com/js/api/share.js?90'
    ]
});

yepnope({
    test: config.development,
    yep: [
        './src/css/main.css',
        './src/css/map.css',
        './src/css/navbar.css',
        './src/css/login.css',
        './src/css/modal.css',
        './src/css/user-list.css',
        './src/css/friends.css'
    ],
    nope: './dist/spacebox.min.css'
});

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
    test: config.development,
    yep: [
        './src/js/app/services/geolocationService.js',
        './src/js/app/services/configService.js',
        './src/js/app/services/mapService.js',
        './src/js/app/services/meetService.js',
        './src/js/app/services/errorService.js',
        './src/js/app/services/locatorService.js',
        './src/js/app/controllers/applicationController.js',
        './src/js/app/controllers/loginViewController.js',
        './src/js/app/controllers/errorViewController.js',
        './src/js/app/controllers/mainViewController.js',
        './src/js/app/controllers/friendsViewController.js',
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
    nope: './dist/spacebox.min.js',
    complete: function () {
        // manually bootstrap AngularJS
        angular.bootstrap(document, ['spacebox']);
    }
});
