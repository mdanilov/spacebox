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
            { name: 'version',     content: VERSION}
        ]
    };
    return gulp.src('index.ejs')
        .pipe(ejs(options))
        .pipe(gulp.dest('.'));
});

gulp.task('manifest', function () {
    return gulp.src(isProduction ? ['index.html', 'dist/**'] : ['index.html', 'src/**'], {base: './'})
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