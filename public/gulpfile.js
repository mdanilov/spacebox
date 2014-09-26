var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var minifyCss = require('gulp-minify-css');
var gutil = require('gulp-util');

gulp.task('clean', function () {
    gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('build', function () {
    gulp.src([
            './src/css/style.css',
            './src/css/wildcard.css'
        ])
        .pipe(concat('spacebox.css'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('spacebox.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('dist'));

    gulp.src([
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
        ])
        .pipe(concat('spacebox.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('spacebox.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
        .on('error', gutil.log);
});
