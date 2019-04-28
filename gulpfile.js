'use strict';
var gulp = require('gulp');

var sass = require('gulp-sass');

//compile
gulp.task('sass', function () {
    gulp.src('app/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/css/converted'));
    });

    //compile and watch
 gulp.task('sass:watch', function() {
    gulp.watch('app/scss/style.scss', ['sass']);
   });