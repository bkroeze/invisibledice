var gulp   = require('gulp');
var lambda = require('gulp-awslambda');
var zip    = require('gulp-zip');
var jasmine = require('gulp-jasmine');

gulp.task('upload', function() {
    return gulp.src('index.js')
        .pipe(zip('archive.zip'))
        .pipe(lambda(lambda_params, opts))
        .pipe(gulp.dest('.'));
});

gulp.task('default', function () {
    return gulp.src('spec/**/*Spec.js')
        .pipe(jasmine({
            verbose: true,
            includeStackTrace: true
        }));
});
