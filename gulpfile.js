var gulp   = require('gulp');
var lambda = require('gulp-awslambda');
var zip    = require('gulp-zip');

gulp.task('upload', function() {
    return gulp.src('index.js')
        .pipe(zip('archive.zip'))
        .pipe(lambda(lambda_params, opts))
        .pipe(gulp.dest('.'));
});
