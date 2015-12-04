var gulp   = require('gulp');
var lambda = require('gulp-awslambda');
var zip    = require('gulp-zip');
var jasmine = require('gulp-jasmine');
var runSequence = require('run-sequence');
var integrationServer;

gulp.task('upload', function() {
  var sources = [
    'index.js',
    'node_modules/node-dice-js/**'
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

gulp.task('startIntegrationServer', function() {
  var db = require('./app/data');
  var dynalite = require('dynalite');
  integrationServer = dynalite({createTableMs: 50});

  // Listen on port 4567
  integrationServer.listen(4567, function(err) {
    if (err) {
      throw err;
    }
    console.log('Dynalite started on port 4567')
  });

  // set the system to use the local Dynalite mock server
  db.updateConfig({endpoint: 'http://localhost:4567'});
});

gulp.task('stopIntegrationServer', function(done) {
  integrationServer.close(function(err) {
    if (err) {
      console.log("Error:", err);
    }
    done();
  });
});

gulp.task('runIntegration', function() {
  return gulp.src('integration/**/*Spec.js')
    .pipe(jasmine({
      verbose: true,
      includeStackTrace: true
    }));
});

gulp.task('integration', function(callback) {
  runSequence('startIntegrationServer', 'runIntegration', 'stopIntegrationServer', callback);
});