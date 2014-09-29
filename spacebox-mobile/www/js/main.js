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
		'./js/services/services.js',
        './js/services/utils.js',
        './js/services/server.js',
        './js/services/navigation.js',
        './js/services/vk.js',
        './js/services/map.js',
        './js/services/model.js',
        './js/services/userlist.js',
        './js/controllers/controllers.js'
    ],
    nope: './dist/spacebox.min.js',
    complete: function () {
        ionic.Platform.ready(function() {
            angular.bootstrap(document, [
            'spacebox-mobile',
            'spacebox-mobile.controllers'
            ]);
        });    
        // angular.bootstrap(document, [
        //     'spacebox-mobile',
        //     'spacebox-mobile.controllers',
        //     'spacebox-mobile.services'
        //]);
    }
});
