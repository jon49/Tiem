// http://travismaynard.com/writing/getting-started-with-gulp
// Include gulp
var gulp = require('gulp') 

// Include Our Plugins
var concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    path = require('path')

// combine array of names with their sources
var combineFileName = function(src, names, extension){
   return names.map(function(v){return path.join(src, v) + extension})
}
var app = combineFileName(
            'js', 
            ['utilities', 'engine', 'objects', 'controller', 'events', 'ui'],
            '.js'),
    libsBower = combineFileName(
            'bower_components',
            ['mithril/mithril', 'jquery/dist/jquery', 'lodash/dist/lodash', 'bilby.js/bilby', 'selectize/dist/js/standalone/selectize'],
            '.js'),
    css = combineFileName(
            'css/',
            ['selectize', 'main'],
            '.css')

var dropboxPath = "/media/jon/ACER/Users/Laura/Documents/Jon/Dropbox/Apps/Static Web Apps/tiem/public",
    staticPath = "dist/static"


// Concatenate & Minify JS
gulp.task('css', function() {
   var dest = path.join(staticPath, 'css'),
       destDrop = path.join(dropboxPath, "css")
   return gulp.src(css)
       .pipe(concat('all.css'))
       .pipe(gulp.dest(destDrop))
       .pipe(gulp.dest(dest))
})

// Concatenate & Minify JS
gulp.task('vendors', function() {
   var dest = path.join(staticPath, 'js'),
       destLib = 'js/lib',
       destDrop = path.join(dropboxPath, "js")
   return gulp.src(libsBower)
       .pipe(gulp.dest(destLib))
       .pipe(concat('all-vendors.js'))
       .pipe(gulp.dest(dest))
       .pipe(gulp.dest(destDrop))
       .pipe(rename('all-vendors.min.js'))
       .pipe(uglify())
       .pipe(gulp.dest(dest))
})


// Concatenate & Minify JS
gulp.task('scripts', function() {
   var dest = path.join(staticPath, 'js'),
       destDrop = path.join(dropboxPath, "js") 
   return gulp.src(app)
       .pipe(concat('all.js'))
       .pipe(gulp.dest(dest))
       .pipe(gulp.dest(destDrop))
       .pipe(rename('all.min.js'))
       .pipe(uglify())
       .pipe(gulp.dest(dest))
})

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(libsBower.concat(app, css), ['vendors', 'scripts', 'css'])
})

// Default Task
gulp.task('default', ['css', 'vendors', 'scripts', 'watch'])
