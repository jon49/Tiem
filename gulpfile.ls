gulp = require 'gulp'
concat = require 'gulp-concat'
uglify = require 'gulp-uglify'
rename = require 'gulp-rename'
path = require 'path'
jasmine = require 'gulp-jasmine'

combineFileName = (src, names, extension) -> names.map ((v) -> (path.join src, v) + extension)

libsBower = combineFileName 'bower_components', [
  'mithril/mithril'
  'jquery/dist/jquery'
  'lodash/dist/lodash'
  'bilby.js/bilby'
  'selectize/dist/js/standalone/selectize'
], '.js'

css = combineFileName 'css/', ['selectize', 'main'], '.css'

gulp.task 'css', ->
  dest = 'dist/static/css'
  gulp.src css
     .pipe concat 'all.css'
     .pipe gulp.dest dest

gulp.task 'libraries', ->
  dest = 'dist/static/js'
  destLib = 'js/lib'
  gulp.src libsBower
     .pipe gulp.dest destLib
     .pipe concat 'all-libraries.js'
     .pipe gulp.dest dest
     .pipe rename 'all-libraries.min.js'
     .pipe uglify!
     .pipe gulp.dest dest

gulp.task 'scripts', ->
  dest = 'dist/static/js'
  gulp.src './js/*.js'
     .pipe concat 'all.js'
     .pipe gulp.dest dest
     .pipe rename 'all.min.js'
     .pipe uglify!
     .pipe gulp.dest dest

gulp.task 'watch', ->
  gulp.watch (libsBower.concat app, css), [
    'libraries'
    'scripts'
    'css'
  ]

gulp.task 'default', [
  'css'
  'libraries'
  'scripts'
  'watch'
]
