yepnope({
    test: config.development,
    yep: [
        './css/style.css',
        './css/wildcard.css'
    ],
    nope: './dist/spacebox.min.css',
    both: [
        './lib/ionic/css/ionic.min.css',
    	'./lib/mapbox.js/mapbox.css'
    ]
});

yepnope([
    './lib/mapbox.js/mapbox.js',
    './lib/ionic/js/ionic.bundle.js'
]);

yepnope({
    test: config.development,
    yep: [
		'./js/app.js',
        './js/services/geolocationService.js',
        './js/services/vkMobileService.js',
        './js/services/mapService.js',
        './js/controllers/controllers.js'
    ],
    nope: './dist/spacebox.min.js',
    complete: function () {
        ionic.Platform.ready(function() {
            angular.bootstrap(document, [
            'spacebox-mobile'
            ]);
        });    
    }
});
