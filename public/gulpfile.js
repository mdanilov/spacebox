var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var minifyCss = require('gulp-minify-css');

gulp.task('clean', function () {
    gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('build', function () {
    gulp.src([
            './src/css/main.css',
            './src/css/map/map.css',
            './src/css/map/leaflet.css',
            './src/css/modals/dialog.css',
            './src/css/modals/match.css',
            './src/css/views/login.css',
            './src/css/views/properties.css',
            './src/css/views/error.css',
            './src/css/views/friends.css',
            './src/css/partials/navbar.css',
            './src/css/partials/chat.css',
            './src/css/partials/friend-list.css',
            './src/css/partials/cards.css',
            './src/css/partials/controls.css'
        ])
        .pipe(concat('spacebox.css'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('spacebox.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('dist'));

    gulp.src([
            './src/js/app/app.js',
            './src/js/app/services/vkService.js',
            './src/js/app/services/geolocationService.js',
            './src/js/app/services/configService.js',
            './src/js/app/services/mapService.js',
            './src/js/app/services/accountService.js',
            './src/js/app/services/friendsService.js',
            './src/js/app/services/errorHandler.js',
            './src/js/app/services/locatorService.js',
            './src/js/app/services/userService.js',
            './src/js/app/services/statusService.js',
            './src/js/app/controllers/applicationController.js',
            './src/js/app/controllers/propertiesController.js',
            './src/js/app/controllers/loginController.js',
            './src/js/app/controllers/errorController.js',
            './src/js/app/controllers/mainController.js',
            './src/js/app/controllers/friendsController.js',
            './src/js/app/controllers/modals/dialogController.js',
            './src/js/app/controllers/modals/matchController.js',
            './src/js/app/filters/distanceFilter.js',
            './src/js/app/filters/ageFilter.js',
            './src/js/app/directives/navbarDirective.js',
            './src/js/app/directives/chatDirective.js',
            './src/js/app/directives/cardsDirective.js',
            './src/js/app/directives/friendListDirective.js',
            './src/js/app/directives/friendListItemDirective.js',
            './src/js/app/directives/radarDirective.js'
        ])
        .pipe(concat('spacebox.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('spacebox.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));

    gulp.src([
        './src/js/app/app.js',
        './src/js/app/services/mobile/vkService.js',
        './src/js/app/services/geolocationService.js',
        './src/js/app/services/accountService.js',
        './src/js/app/services/configService.js',
        './src/js/app/services/mapService.js',
        './src/js/app/services/friendsService.js',
        './src/js/app/services/errorHandler.js',
        './src/js/app/services/locatorService.js',
        './src/js/app/services/userService.js',
        './src/js/app/services/statusService.js',
        './src/js/app/controllers/applicationController.js',
        './src/js/app/controllers/propertiesController.js',
        './src/js/app/controllers/loginController.js',
        './src/js/app/controllers/errorController.js',
        './src/js/app/controllers/mainController.js',
        './src/js/app/controllers/friendsController.js',
        './src/js/app/controllers/modals/dialogController.js',
        './src/js/app/controllers/modals/matchController.js',
        './src/js/app/filters/distanceFilter.js',
        './src/js/app/filters/ageFilter.js',
        './src/js/app/directives/navbarDirective.js',
        './src/js/app/directives/chatDirective.js',
        './src/js/app/directives/cardsDirective.js',
        './src/js/app/directives/friendListDirective.js',
        './src/js/app/directives/friendListItemDirective.js',
        './src/js/app/directives/radarDirective.js'
    ])
        .pipe(concat('spacebox-mobile.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('spacebox-mobile.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('cordova', function () {
    gulp.src([
        './lib/bootstrap/dist/css/bootstrap.css',
        './lib/components-font-awesome/css/font-awesome.css',
        './lib/mapbox.js/mapbox.uncompressed.css',
        './lib/moment/moment.js',
        './lib/moment/locale/ru.js',
        './lib/angular-carousel/dist/angular-carousel.css',
        './lib/seiyria-bootstrap-slider/css/bootstrap-slider.css',
        './lib/jquery/dist/jquery.js',
        './lib/bootstrap/dist/js/bootstrap.js',
        './lib/mapbox.js/mapbox.uncompressed.js',
        './lib/leaflet.locatecontrol/src/L.Control.Locate.js',
        './lib/angular/angular.js',
        './lib/angular-route/angular-route.js',
        './lib/angular-touch/angular-touch.js',
        './lib/angular-cookies/angular-cookies.js',
        './lib/angular-animate/angular-animate.js',
        './lib/angular-moment/angular-moment.js',
        './lib/angular-bootstrap/ui-bootstrap.js',
        './lib/angular-bootstrap/ui-bootstrap-tpls.js',
        './lib/angular-carousel/dist/angular-carousel.js',
        './lib/seiyria-bootstrap-slider/js/bootstrap-slider.js',
        './dist/spacebox-mobile.min.js',
        './dist/spacebox.min.css',
    ])
        .pipe(gulp.dest('cordova'));
});
