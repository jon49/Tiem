/**
 * Contains functions for view.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k, m, b */

// create an object of lens objects
var makeLenses = _.compose(zipObjectT(_.identity, b.objectLens), _.unique)

// get value by lens
var getNow = function(lens, thisArg){
   return lens.run(thisArg || this).getter
}

var get = _.curry(getNow)

// set key of object and return a 'new' object
var setNow = function(lens, object, value){
   var newObject = lens.run(object).setter(value)
   return _.isEqual(newObject.__proto__, object.__proto__) ? newObject : (newObject.__proto__ = object.__proto__, newObject)
}
var set = _.curry(setNow)

// wrap an object in an `option`
var toOption = function(thisArg){
   var self = thisArg || this
   return _.isEmpty(self) || _.isEqual(self.self, window) ? b.none : b.some(self)
}

// get an object from an array and wrap in `option`
// example: filterByLensNow(L.list, L.id, 0) => plucked object
var filterByLensNow = function(lens, value, list){
   var list_ = (list || this)
   return toOption(_.first(_.filter(list_, function(o){
      return _.isEqual(get(lens, o), value)
   })))
}

//var filterByLens = _.curry(filterByLensNow)

// Exclusively add object (unwrapped) to list based on comparator
// example: xAddToList(lensId, someNone, []) => [object] OR []
var xAddToList = function(lens, option, list){
   var list_ = list || this
   return option.fold(function(opt){
      var isSame = isEqual(get(lens, opt))
      return _.reject(list_, function(o){
         return isSame(get(lens, o))
      }).concat(opt)
      }
   , list_)
}

// set new value in option object
// http://thisisafiller.ghoster.io/notes-on-functional-programming-patterns-for-the-non-mathematician-with-brian-lonsdorf/
// example: over(numberLens, b.constant(2), b.some({number: 1})) => b.some({number: 2})
var overNow = function(lens, fn, thisArg){
   var self = (thisArg || this)
   return set(lens, self, fn.call(null, lens.run(self).getter))
}

var over = _.curry(overNow)

