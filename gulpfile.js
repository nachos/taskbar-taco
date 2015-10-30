/** Regular npm dependendencies */
var gulp = require('gulp');
var childProcess = require('child_process');
var spawn = childProcess.spawn;
var gulpExec = require('gulp-exec');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var del = require('del');
var stylish = require('jshint-stylish');
var rimraf = require('rimraf');
var ncp = require('ncp');
var path = require('path');
var mkdirp = require('mkdirp');

/** Gulp dependencies */
var gutil = require('gulp-util');
var inject = require('gulp-inject');
var less = require('gulp-less');
var jshint = require('gulp-jshint');
var runElectron = require("gulp-run-electron");
var nachosBuild = require("nachos-build");

/** Grab-bag of build configuration. */
var config = {};

/** Gulp tasks */

gulp.task('default', ['test']);

gulp.task('test', ['jshint']);

gulp.task('jshint', function () {
  gulp.src(['./client/**/*.js', '!./client/bower_components/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('serve', function (cb) {
  runSequence(
    'build',
    'electron',
    cb);
});

gulp.task('serve:dist', function (cb) {
  runSequence(
    'build',
    cb);
});

gulp.task('build', function (cb) {
  runSequence(
    'clean:tmp',
    'less',
    'inject:css',
    'inject:js',
    'wiredep',
    cb);
});

gulp.task('build:dist', function (cb) {
  runSequence(
    'lint',
    'build',
    'electron:build',
    cb);
});

gulp.task('electron:build', function (cb) {
  nachosBuild(cb);
});

gulp.task('wiredep', function () {
  gulp.src('client/index.html')
    .pipe(wiredep({
      ignorePath: 'client/'
    }))
    .pipe(gulp.dest('client'));
});

gulp.task('less', ['inject:less'], function () {
  return gulp.src([
      'client/app/app.less'
    ])
    .pipe(less({
      paths: [
        'client/bower_components',
        'client/app',
        'client/components'
      ]
    }))
    .pipe(gulp.dest('.tmp/app'));
});

gulp.task('inject:less', function () {
  return gulp.src('client/app/app.less')
    .pipe(inject(gulp.src([
      'client/{app,components}/**/*.less',
      '!client/app/app.less'
    ], {read: false}), {
      transform: function (filePath) {
        filePath = filePath.replace('/client/app/', '');
        filePath = filePath.replace('/client/components/', '');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector'
    }))
    .pipe(gulp.dest('client/app'));
});

gulp.task('inject:css', function () {
  return gulp.src('client/index.html')
    .pipe(inject(gulp.src([
      'client/{app,components}/**/*.css'
    ], {read: false}), {
      transform: function (filePath) {
        filePath = filePath.replace('/client/', '');
        filePath = filePath.replace('/.tmp/', '');
        return '<link rel="stylesheet" href="' + filePath + '">';
      },
      starttag: '<!-- injector:css -->',
      endtag: '<!-- endinjector -->'
    }))
    .pipe(gulp.dest('client'));
});

gulp.task('inject:js', function () {
  return gulp.src('client/index.html')
    .pipe(inject(gulp.src([
      'client/{app,components}/**/*.js',
      '!client/app/app.js',
      '!client/{app,components}/**/*.spec.js',
      '!client/{app,components}/**/*.mock.js'
    ], {read: false}), {
      transform: function (filePath) {
        filePath = filePath.replace('/client/', '');
        return '<script src="' + filePath + '"></script>';
      },
      starttag: '<!-- injector:js -->',
      endtag: '<!-- endinjector -->'
    }))
    .pipe(gulp.dest('client'));
});

gulp.task('clean', ['clean:tmp', 'clean:dist']);

gulp.task('clean:tmp', function (cb) {
  del(['.tmp'], cb);
});

gulp.task('clean:dist', function (cb) {
  del(['dist'], cb);
});

gulp.task('electron', function () {
  return gulp.src('.')
    .pipe(runElectron());
});


