/**
 * Contains useful functions for general use.
 **Utilities**
 */

 var 
   _ = require('./../../node_modules/lodash/lodash'),
   environment = require('./../../node_modules/fantasy-environment/fantasy-environment'),
   helpers = require('./../../node_modules/fantasy-helpers/fantasy-helpers'),
   Option = require('./../../node_modules/fantasy-options/option'),
   lens = require('./../../node_modules/fantasy-lenses/lens').Lens.objectLens

// Turns the `throw new Error(s)` statement into an expression. - bilby.js
var error = function(s){
   return function(){
      throw new Error(s)
   }
}

// validate multiple predicates of multiple values
// e.g., identifiers([_.isString, _.isNumber])('string', 7)
var identifiers = _.curry(function(arrayIs, values){
   var args = _.toArray(arguments).slice(1),
       range
   if (!_.isEqual(arrayIs.length, args.length)) error('identifiers requries equal length arrays.')
   range = _.range(arrayIs.length)
   return _.reduce(range, function(result, index){
      return result && arrayIs[index].call(null, args[index])
   }, true)
})

// validate multiple predicates of multiple values and return
// only values argument if true, else throw error
// e.g., identifiers([_.isString, _.isNumber])('string', 7)
var implement = _.curry(function(arrayIs, values){
   return (
      identifiers.apply(null, arguments)
      ? _.toArray(arguments).slice(1)
      : error('Method not implemented for this input.')()
   )
})

// Apply array of arguments to function
var apply = _.curry(function(f, args){
   return f.apply(null, args)
})

var guardedCurry = function(f, identifiers, arity){
   return _.curry(_.compose(apply(f), implement(identifiers)), arity)
}

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

//Check key name and value type of singleton
var isSingletonOf = _.curry(function(keyName, valueType, singleton){
   return _.has(singleton, keyName) && valueType.call(null, singleton[keyName])
})

// Determine if option is an option and passes test function
var isOptionOf = _.curry(function(predicate, option){
   return isOption(option) ? option.fold(predicate, _.constant(true)) : false
})

var isOption = helpers.isInstanceOf(Option)
var isSome = helpers.isInstanceOf(Option.Some)
var isNone = function(o){
   return isOption(o) && not(isSome(o))
}

//altered from bilby.js - I want everything to stay a plain object with a _name so I can use 
//getters/setters without messing up the naming of my object, KISS.
var tagged = function(name, fields, defaults){
   var defaultObject = _.zipObject(fields.concat("ctor"), defaults.concat(name))
   return function(){
      var args, object
      if(arguments.length != fields.length){
         throw new TypeError("Expected " + fields.length + " argument(s), got " + arguments.length)
      }
      args = 
         _.toArray(arguments).map(function(a){
            return (isNone(a) ? void 0 : a)
      })
      object = _.defaults(_.zipObject(fields, args), defaultObject)
      _(_.functions(object)).forEach(function(f){
         object[f] = object[f].call(null)
      })
      return object
   }
}


// determine if object is named `name`
var isObjectNamed = function(name, object){
   return _.isEqual(name, object.ctor)
}

// create a single key/value pair plain object
var singleton = function(key, value){
   var o
   return (
       o = {},
       o[key] = value, 
       o
   )
}

// create an object of lens objects
var makeLenses = zipObjectT(_.identity, lens)

/**
 * Uses an array of array structure to create constants.
 * @example tiem.constants([['yep', 'yay!'], ['nope']]) => {yep: _.constant('yay!'), nope: _.constant('nope')}
 * @param {Array<Object>} array Array of arrays which map to object.
 * @param {<Object>}
 */
var zipObjectArray = zipObjectT(_.identity, _.identity)

/**
* @param {Date} date Date/Time to convert to fractions of hours.
* @returns {Number} Fractional representation of hours.
*/
var fractionalHours = function (date) {
return date.getHours() + (date.getMinutes() + date.getSeconds() / 60) / 60
}

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
   .property('isOption', isOption)
   .property('isNone', isNone)
   .property('isSome', isSome)
   .property('identifiers', identifiers)
   .property('error', error)
   .property('implement', implement)
   .property('apply', apply)
   .property('isObjectNamed', guardedCurry(isObjectNamed, [_.isString, _.isPlainObject], 2))
   .property( 'isSingletonOf', guardedCurry(isSingletonOf, [_.isString, _.isFunction, _.isPlainObject], 3))
   .property('singleton', guardedCurry(singleton, [_.isString], 2))
   .property('makeLenses', makeLenses)
   .property('zipObjectArray', zipObjectArray)
   .method(
      'tagged',
      identifiers([_.isString, _.isArray, _.isArray]),
      tagged
   )
   .method(
      'guardedCurry',
      identifiers([_.isFunction, isArrayOf(_.isFunction), _.isNumber]),
      guardedCurry
   )
   .method(
      'fractionalHours',
      identifiers([_.isDate]),
      fractionalHours
   )

module.exports = utils
