var gulp   = require('gulp');
var lambda = require('gulp-awslambda');
var zip    = require('gulp-zip');
var jasmine = require('gulp-jasmine');

gulp.task('upload', function() {
    var sources = [
        'index.js',
        'node_modules/node-dice-js/**',
    ];
    return gulp.src(sources, {base: "."})
        .pipe(zip('archive.zip'))
        //.pipe(lambda(lambda_params, opts))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', function () {
    return gulp.src('spec/**/*Spec.js')
        .pipe(jasmine({
            verbose: true,
            includeStackTrace: true
        }));
});
