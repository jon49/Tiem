/**
 * Contains useful functions for general use.
 **Utilities**
 */

 var 
   _ = require('./../../node_modules/lodash/lodash'),
   environment = require('./../../node_modules/fantasy-environment/fantasy-environment')
   helpers = require('./../../node_modules/fantasy-helpers/fantasy-helpers')
   Option = require('./../../node_modules/fantasy-options/option')

/**
 * Takes a number and determines if it is a whole number.
 * @param {Number} number Number to test.
 * @returns {Boolean} True if whole number otherwise false.
 */
var isWholeNumber = function (number) {
   return (_.isNumber(number) && (number > -1) && (Math.floor(number) === number))
}

/**
 * Converts to array then flattens results.
 * @param {Object} object Object to put in flattened array.
 * @returns {Array<Object>} Flattened array of objects.
 */
var toFlatArray = _.compose(_.flatten, _.toArray)

/**
 * Takes complement of a function.
 * @param {function(*):Boolean} predicate Function which returns a boolean.
 * @returns {function(*):Boolean} Function which returns the opposite of the original value.
 * @author Michael Fogus see: https://github.com/funjs/book-source
 */
var complement = function (predicate) {
   return function () {
      return !predicate.apply(null, _.toArray(arguments))
   }
}

// curry and flip arguments of function
var flip = function(f){
   return function(a) {
      return function(b){
         return f(b, a)
      }
   }
}

var isLikeNumber = function (num) {
   return !isNaN(parseFloat(num)) && isFinite(num)
}

/**
 * Sums an array.
 * @example sum([1, 2, 3]) => 6
 * @param {Array<Number>} array Array to sum.
 * @returns {Number} Sum.
 */
var sum = function (array) {
   return _.reduce(array, function (sum, num) {
      return sum + (isLikeNumber(num) ? +num : 0)
   })
}

/**
 * Zips array of objects with functions.
 * @example tiem.zipObjectT(['Hello'], _.identity, function(){return ', world!'}) => {Hello: ', world!'}
 * @param {Array<Object>} array Array of objects to map and zip.
 * @param {function(<Object>)} funcKey Function which acts on key value of object.
 * @param {function(<Object>)} funcValue Function which act on value of the object.
 * @returns {<Object>} Returns an object.
 */
var zipObjectT = _.curry(function (funcKey, funcValue, array) {
   return _.zipObject(_.map(array, funcKey), _.map(array, funcValue))
})

var isEqual = _.curry(_.isEqual, 2)
 
var not = complement(_.identity)
 
// Append/prepend to new array
var concat = _.curry(function(a, b){
   return _.isArray(a) ? a.concat(b) : b.concat(a)
})

//Lodash function changed for single item
var invokeNow = function(methodName, value, args){
   var isFunc = typeof methodName == 'function',
       func = isFunc ? methodName : (value !== null && value[methodName]),
       args_ = _.isArray(args) ? args : []
   return func ? func.apply(value, args_) : void 0
}

var invoke = _.curry(invokeNow, 2)

// Determine if array contains a single object type
var isArrayOf = _.curry(function(fn, a){
   return _.isArray(a) && _.all(a, fn)
})

// Determine if option is an option and passes test function
var isOptionOf = _.curry(function(predicate, option){
   isOption = helpers.isInstanceOf(Option)
   return isOption(option) ? option.fold(predicate, _.constant(true)) : false
})

// //altered from bilby.js - I want everything to stay a plain object with a _name so I can use 
// //getters/setters without messing up the naming of my object, KISS.
// var tagged = function(name, fields, defaults){
//    var defaultObject = _.zipObject(fields.concat("ctor"), defaults.concat(name))
//    return function(){
//       var args, object
//       if(arguments.length != fields.length){
//          throw new TypeError("Expected " + fields.length + " arguments, got " + arguments.length)
//       }
//       args = (
//          _.toArray(arguments)).map(function(a){
//             return (b.isNone(a) ? void 0 : a)
//       }).value()
//       object = _.defaults(_.zipObject(fields, args), defaultObject)
//       _(_.functions(object)).forEach(function(f){
//          object[f] = object[f]()
//       })
//       return object
//    }
// }
// 
// // validate multiple predicates of multiple values
// var identifiers = _.curry(function(arrayIs, values){
//    var values_ = _.toArray(arguments).slice(1)
//    if (!_.isEqual(arrayIs.length, values_.length)) b.error('identifiers requries equal length arrays.')
//    return _(_.range(arrayIs.length)).map(function(index){
//       return arrayIs[index].call(null, values_[index])
//    })
// })
// 
// // determine if object is named `name`
// var isObjectNamed = _.curry(function(name, object){
//    return _.isEqual(name, object.ctor)
// })

var utils = 
   environment()
   .property('isWholeNumber', isWholeNumber)
   .property('toFlatArray', toFlatArray)
   .property('complement', complement)
   .property('flip', flip)
   .property('isLikeNumber', isLikeNumber)
   .property('sum', sum)
   .property('zipObjectT', zipObjectT)
   .property('isEqual', isEqual)
   .method('not', _.isBoolean, not)
   .property('invoke', invoke)
   .property('isArrayOf', isArrayOf)
   .property('isOptionOf', isOptionOf)
//    .property('identifiers', identifiers)
//    .method(
//       'tagged',
//       identifiers([_.isString, _.isArray, _.isArray]),
//       tagged
//    )
//    .method(
//       'isObjectNamed',
//       identifiers([_.isString, _.isPlainObject]),
//       isObjectNamed
//    )

module.exports = utils
