yepnope({
    test: config.development,
    yep: [
        './src/css/style.css',
        './src/css/wildcard.css'
    ],
    nope: './dist/spacebox.min.css',
    both: './lib/mapbox.js/mapbox.css'
});

yepnope([
    'https://vk.com/js/api/openapi.js',
    './lib/jquery/dist/jquery.min.js',
    './lib/bootstrap/dist/js/bootstrap.min.js',
    './lib/mapbox.js/mapbox.js',
    './lib/angular/angular.min.js',
    './lib/angular-route/angular-route.min.js'
]);

yepnope({
    test: config.development,
    yep: [
        './src/js/app/app.js',
        './src/js/app/services/geolocationService.js',
        './src/js/app/services/vkService.js',
        './src/js/app/services/mapService.js',
        './src/js/app/controllers/pageControllers.js'
    ],
    nope: './dist/spacebox.min.js'
});
