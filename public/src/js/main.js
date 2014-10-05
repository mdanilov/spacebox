yepnope({
    test: config.development,
    yep: [
        './src/css/main.css',
        './src/css/navbar.css',
        './src/css/login.css',
        './src/css/modal.css',
        './src/css/user-list.css'
    ],
    nope: './dist/spacebox.min.css',
    both: './lib/mapbox.js/mapbox.css'
});

yepnope([
    'https://vk.com/js/api/openapi.js',
    './lib/mapbox.js/mapbox.js',
    './lib/jquery/dist/jquery.min.js',
    './lib/bootstrap/dist/js/bootstrap.min.js',
    './lib/angular/angular.js',
    './lib/angular-route/angular-route.min.js',
    './lib/angular-animate/angular-animate.js',
    './lib/angular-bootstrap/ui-bootstrap-tpls.js'
]);

yepnope({
    test: config.development,
    yep: [
        './src/js/app/app.js',
        './src/js/app/services/geolocationService.js',
        './src/js/app/services/vkService.js',
        './src/js/app/services/mapService.js',
        './src/js/app/services/meetService.js',
        './src/js/app/controllers/pageControllers.js',
        './src/js/app/controllers/userListItemController.js',
        './src/js/app/controllers/listController.js',
        './src/js/app/controllers/modalController.js',
        './src/js/app/controllers/loginController.js',
        './src/js/app/filters/distanceFilter.js',
        './src/js/app/filters/meetFilter.js',
        './src/js/app/filters/ageFilter.js'
    ],
    nope: './dist/spacebox.min.js',
    complete: function () {
        angular.bootstrap(document, ['spacebox']);
    }
});
