var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var ejs = require('gulp-ejs');
var minifyCss = require('gulp-minify-css');
var manifest = require('gulp-manifest');
var args = require('yargs').argv;

var isProduction = (process.env.NODE_ENV == 'production') || args.production;
var VERSION = '0.0.4 Alpha';
var libraries = {
    development: [
        /* CSS third-party */
        'lib/bootstrap/dist/css/bootstrap.min.css',
        'lib/components-font-awesome/css/font-awesome.min.css',
        'lib/mapbox.js/mapbox.css',
        'lib/angular-carousel/dist/angular-carousel.min.css',
        'lib/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
        /* JS third-party */
        'lib/yepnope/yepnope.1.5.0-min.js',
        'lib/moment/min/moment-with-locales.min.js',
        'lib/socket.io-client/socket.io.js',
        'lib/jquery/dist/jquery.js',
        'lib/bootstrap/dist/js/bootstrap.js',
        'lib/mapbox.js/mapbox.uncompressed.js',
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
        '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.8.4/moment-with-locales.min.js',
        '//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.min.js',
        '//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-route.min.js',
        '//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-resource.min.js',
        '//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-animate.min.js',
        '//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-cookies.min.js',
        '//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-touch.min.js',
        '//cdn.socket.io/socket.io-1.2.1.js',
        'lib/yepnope/yepnope.1.5.0-min.js',
        'lib/angular-local-storage/dist/angular-local-storage.min.js',
        'lib/angular-moment/angular-moment.min.js',
        'lib/angular-bootstrap/ui-bootstrap.min.js',
        'lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'lib/angular-carousel/dist/angular-carousel.min.js',
        'lib/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
        /* VK scripts */
        'https://vk.com/js/api/openapi.js',
        'https://vk.com/js/api/share.js?90'
    ]
};

gulp.task('clean', function () {
    gulp.src(['dist', 'app.manifest', 'index.html'], {read: false})
        .pipe(clean());
});

gulp.task('build', ['templates', 'css', 'scripts', 'manifest']);

gulp.task('templates', function () {
    var options = {
        settings: [
            { name: 'development', content: !isProduction },
            { name: 'cordova',     content: !!args.cordova },
            { name: 'server_url',  content: args.server_url || '' },
            { name: 'version',     content: VERSION }
        ]
    };
    return gulp.src('index.ejs')
        .pipe(ejs(options))
        .pipe(gulp.dest('.'));
});

gulp.task('manifest', function () {
    var sources = [
        'index.html',
        'src/img/**',
        'src/js/main.js',
        'src/js/app/templates/**'
    ];

    sources = isProduction ?
        sources.concat([
            'dist/spacebox.min.css',
            'dist/spacebox.min.js',
            'dist/spacebox-mobile.min.js'
        ], libraries.production) :
        sources.concat([
            'dist/spacebox.css',
            'dist/spacebox.js',
            'dist/spacebox-mobile.js'
        ], libraries.development);

    return gulp.src(sources, {base: './'})
        .pipe(manifest({
            hash: true,
            preferOnline: true,
            network: ['http://*', 'https://*', '*'],
            filename: 'app.manifest',
            exclude: 'app.manifest'
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('css', function () {
    return gulp.src([
        'src/css/main.css',
        'src/css/map/map.css',
        'src/css/map/leaflet.css',
        'src/css/modals/dialog.css',
        'src/css/modals/match.css',
        'src/css/views/login.css',
        'src/css/views/main.css',
        'src/css/views/properties.css',
        'src/css/views/error.css',
        'src/css/views/friends.css',
        'src/css/partials/navbar.css',
        'src/css/partials/chat.css',
        'src/css/partials/friend-list.css',
        'src/css/partials/cards.css',
        'src/css/partials/controls.css',
        'src/css/widgets/status.css',
        'src/css/widgets/album.css',
        'src/css/widgets/tabs.css',
        'src/css/widgets/radar.css'
    ])
        .pipe(concat('spacebox.css'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('spacebox.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function () {
    function getJavaScriptSources (app) {
        var dependencies = [];
        switch (app) {
            case 'web':
                dependencies = [
                    'src/js/app/services/vkService.js'
                ];
                break;
            case 'mobile':
                dependencies = [
                    'src/js/app/services/mobile/vkService.js'
                ];
                break;
            default:
                break;
        }

        var sources = new Array('./src/js/app/app.js');
        sources = sources.concat(dependencies, [
            /* services */
            'src/js/app/services/locationService.js',
            'src/js/app/services/configService.js',
            'src/js/app/services/likesService.js',
            'src/js/app/services/friendsService.js',
            'src/js/app/services/errorHandler.js',
            'src/js/app/services/locatorService.js',
            'src/js/app/services/accountService.js',
            'src/js/app/services/messagesService.js',
            'src/js/app/services/userService.js',
            'src/js/app/services/statusService.js',
            /* controllers */
            'src/js/app/controllers/applicationController.js',
            'src/js/app/controllers/propertiesController.js',
            'src/js/app/controllers/loginController.js',
            'src/js/app/controllers/errorController.js',
            'src/js/app/controllers/usersController.js',
            'src/js/app/controllers/friendsController.js',
            'src/js/app/controllers/modals/dialogController.js',
            'src/js/app/controllers/modals/matchController.js',
            /* filters */
            'src/js/app/filters/distanceFilter.js',
            'src/js/app/filters/ageFilter.js',
            /* directives */
            'src/js/app/directives/navbar.js',
            'src/js/app/directives/chat.js',
            'src/js/app/directives/list.js',
            'src/js/app/directives/listItem.js',
            'src/js/app/directives/map.js',
            'src/js/app/directives/widgets/card.js',
            'src/js/app/directives/widgets/radar.js',
            'src/js/app/directives/widgets/album.js',
            'src/js/app/directives/widgets/status.js',
            'src/js/app/directives/widgets/tabs.js'
        ]);

        return sources;
    }

    gulp.src(getJavaScriptSources('web'))
        .pipe(concat('spacebox.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('spacebox.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));

    gulp.src(getJavaScriptSources('mobile'))
        .pipe(concat('spacebox-mobile.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('spacebox-mobile.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});