/**
 * Contains functions for view.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k, m, b */

// create an object of lens objects
var makeLenses = _.compose(zipObjectT(_.identity, b.objectLens), _.unique)

// get value by lens
var get = function(lens, thisArg){
   return lens.run(thisArg || this).getter
}

// set key of object and return a 'new' object
var set = _.curry(function(lens, thisArg, value){
   return lens.run(thisArg).setter(value)
})

// wrap an object in an `option`
var toOption = function(thisArg){
   var o = thisArg || this
   return _.isEmpty(o) ? b.none : b.some(o)
}

// get an object from an array and wrap in `option`
// example: getOption({id: 1}, list) => pluckedOption
var filterToOption = function(lens, value, list){
   var isSame = isEqual(get(lens, value))
   return _.compose(toOption, _.first, _.filter)(list, function(o){
      return isSame(get(lens, o))
   })
}

// Exclusively add object (unwrapped) to list based on comparator
// example: xAddToList(lensId, someNone, []) => [object] OR []
var xAddToList = function(lens, option, list){
      var l = list || this
      return option.fold(function(opt){
         var isSame = isEqual(get(lens, opt))
         return _.reject(l, function(o){
            return isSame(get(lens, o))
         }).concat(opt)}
      , l)
}

// set new value in option object
// http://thisisafiller.ghoster.io/notes-on-functional-programming-patterns-for-the-non-mathematician-with-brian-lonsdorf/
// example: over(numberLens, b.constant(2), b.some({number: 1})) => b.some({number: 2})
var over = function(lens, fn, thisArg){
   return (thisArg || this).map(
      function(o){
         var over_ = _.compose(set(lens, o), _.partial(fn.call, o))
         return over_(get(lens, o))
      })
}

