var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    del = require('del'),
    concat = require('gulp-concat'),
    pkg = require('./package.json'),
    rename = require('gulp-rename')
    ;

var paths = {src: './src', api_doc: './api_doc', dist: './dist'};


paths.js = paths.src + '/js';
paths.less = paths.src + '/less';
paths.locale = paths.js + '/ajaxSelectPicker.locale';

gulp.task('default', []);
gulp.task('lint', ['lint:locale', 'lint:plugin']);
gulp.task('clean', ['clean:plugin', 'clean:locale', 'clean:styles']);

var lint = function(pathArr) {
    return gulp.src(pathArr)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

gulp.task('lint:locale', function() {
    return lint([paths.locale + '/**/*.js']);
});

gulp.task('lint:plugin', function() {
    return lint([paths.js + '/**/*.js']);
});

gulp.task('clean:plugin', function() {
    return del([
        paths.api_doc,
        paths.dist + '/js/*.js'
    ]);
});

gulp.task('clean:locale', function() {
    return del([paths.dist + '/locale/*']);
});

gulp.task('clean:styles', function() {
    return del([paths.dist + '/css/*']);
});

gulp.task('copy:locale', ['clean:locale'], function() {
    return gulp.src([paths.locale + '/*.js'])
        .pipe(rename(function(path) {
            path.basename = pkg.name + '.' + path.basename;
            return path;
        }))
        .pipe(gulp.dest(paths.dist + '/js/locale'));
});
