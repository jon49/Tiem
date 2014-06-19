// http://travismaynard.com/writing/getting-started-with-gulp
// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// combine array of names with their sources
var combineFileName = function(src, names, extension){
   return names.map(function(v){return src + v + extension})
}
var app = combineFileName(
            'js/', 
            ['utilities', 'engine', 'objects', 'controller', 'events', 'ui'],
            '.js')
var libs = combineFileName(
            'bower_components/',
            ['mithril/mithril', 'jquery/dist/jquery.min', 'lodash/dist/lodash', 'bilby.js/bilby', 'selectize/dist/js/standalone/selectize.min'],
            '.js')
var css = combineFileName(
            'css/',
            ['selectize', 'main'],
            '.css')

// Concatenate & Minify JS
gulp.task('css', function() {
   var dest = 'dist/static/css'
   return gulp.src(css)
       .pipe(concat('all.css'))
       .pipe(gulp.dest(dest));
});

// Concatenate & Minify JS
gulp.task('libraries', function() {
   var dest = 'dist/static/js'
   return gulp.src(libs)
       .pipe(concat('all-libraries.js'))
       .pipe(gulp.dest(dest))
       .pipe(rename('all-libraries.min.js'))
       .pipe(uglify())
       .pipe(gulp.dest(dest));
});


// Concatenate & Minify JS
gulp.task('scripts', function() {
   var dest = 'dist/static/js'
   return gulp.src(app)
       .pipe(concat('all.js'))
       .pipe(gulp.dest(dest))
       .pipe(rename('all.min.js'))
       .pipe(uglify())
       .pipe(gulp.dest(dest));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(libs.concat(app, css), ['libraries', 'scripts', 'css']);
});

// Default Task
gulp.task('default', ['css', 'libraries', 'scripts', 'watch']);
