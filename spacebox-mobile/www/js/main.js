yepnope({
    test: config.development,
    yep: [
        './src/css/style.css',
        './src/css/wildcard.css'
    ],
    nope: './dist/spacebox.min.css',
    both: [
        './lib/ionic/css/ionic.min.css',
    	'./lib/mapbox.js/mapbox.css'
    ]
});

yepnope([
    './lib/jquery/dist/jquery.min.js',
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
    nope: './dist/spacebox.min.js'
});
