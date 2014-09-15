var 
   _ = require('./../../node_modules/lodash/lodash.js'),
   environment = require('./../../node_modules/fantasy-environment/fantasy-environment'),
   Option = require('./../../node_modules/fantasy-options/option'),
   t = require('./utilities.js')

// get value by lens
var getNow = function(lens, object){
   return lens.run(object).get()
}

var get = _.curry(getNow)

//set key of object and return a 'new' object
var setNow = function(lens, object, singleton){
   var value = _.first(_.values(singleton))
   return lens.run(object).set(value)
   //return _.create(Object.getPrototypeOf(object), lens.run(object).setter(value))
}
var set = _.curry(setNow)

// wrap an object in an `option`
var toOption = function(value){
   return !_.isEmpty(value) || _.isNumber(value) || _.isBoolean(value) ? Option.Some(value) : Option.None
}

// get an object from an array and wrap in `option`
// example: filterByLensNow(L.list, L.id, 0) => plucked object
var filterByLensNow = function(lens, list, value){
   return toOption(_.find(list, function(o){
      return _.isEqual(getNow(lens, o), value)
   }))
}

var filterByLens = _.curry(filterByLensNow)

// Exclusively add object (unwrapped) to list based on comparator
// example: xAddToList(lensId, option, []) => [object] OR []
var xAddToListNow = function(lens, object, list){
   var isSame = t.isEqual(lens.run(object).get())
   return _.reject(list, function(o){
      return isSame(lens.run(o).get())
   }).concat(object)
}

var xAddToList = _.curry(xAddToListNow)

var objectUtils = 
   environment()
   .property('getNow', getNow)
   .property('get', get)
   .property('setNow', setNow)
   .property('set', set)
   .property('toOption', toOption)
   .property('filterByLensNow', filterByLensNow)
   .property('filterByLens', filterByLens)
   .property('xAddToListNow', xAddToListNow)
   .property('xAddToList', xAddToList)

module.exports = objectUtils
