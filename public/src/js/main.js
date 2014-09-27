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
    './lib/angular/angular-route.min.js'
]);

yepnope({
    test: config.development,
    yep: [
        './src/js/app/utils.js',
        './src/js/app/server.js',
        './src/js/app/navigation.js',
        './src/js/app/vk.js',
        './src/js/app/pages/pglogin.js',
        './src/js/app/thirdparty/ejs_0.9_alpha_1_production.js',
        './src/js/app/views/userlist.js',
        './src/js/app/views/navbar.js',
        './src/js/app/views/map.js',
        './src/js/app/model.js',
        './src/js/app/pages/pgmain.js'
    ],
    nope: './dist/spacebox.min.js'
});
