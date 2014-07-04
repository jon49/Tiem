/**
 * Created by jon on 2/13/14.
 */

/*jslint asi: true*/
/*jshint indent:3, curly:false, laxbreak:true */
/* global _, bilby  */

/**
 * Contains useful functions for general use.
 **Utilities**
 */

"use strict";

var b = bilby
var t = b.environment()

var f = function(func){
   var funcArray = func.split('->')
   return (funcArray.length === 1)
          ? new Function('x', 'return (' + funcArray[0].trim() + ')')
          : new Function(funcArray[0].trim(), 'return (' + funcArray[1].trim() + ')')
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
 * Determine if items in object are unique.
 * @param {Array<Object>} objects Objects to test if they are unique.
 * @param {String} property Property name of object to test against.
 * @returns {Boolean} True if unique, otherwise false.
 */
var areUniqueNow = function (property, objects) {
   return (_.isEmpty(objects)) 
          ? false
          : _.isEqual(_.uniq(_.map(objects, property)).length, objects.length)
}

var areUnique = _.curry(areUniqueNow)

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

/**
 * Adds a fraction value to array between two values.
 * @example tiem.addRollingArray([0, 0, 0, 0], 1.5, 4, 1) -> [0, 0.5, 1, 1]
 * @param {Array<Number>} array Original array values.
 * @param {Number} start Start index to begin can be fraction.
 * @param {Number} end End index to begin, can be be fraction.
 * @param {Number} fraction Value to add to array index, if at end or beginning will take the fraction of the value.
 * @returns {Array<Number>} a new array with added values.
 */
var addRollingArray = function (array, start, end, fraction) {
   var floor = Math.floor
   return _.map(array, function (value, index) {
      var isIndexBetween = (floor(start) <= index && index <= floor(end)),
          isIndexStart = (floor(start) === index),
          isIndexEnd = (floor(end) === index)
      return   isIndexBetween ? 
                    isIndexStart && isIndexEnd ? fraction * (end - start) + value
                  : isIndexStart               ? fraction * (1 + index - start) + value
                  : isIndexEnd                 ? fraction * (end - index) + value
                  : fraction + value // Index is fully between start and end values
               : value // Index is out of bounds return original value
   })
}

/**
 * @param {Date} date Date/Time to convert to fractions of hours.
 * @returns {Number} Fractional representation of hours.
 */
var fractionalHours = function (date) {
   return date.getHours() + (date.getMinutes() + date.getSeconds() / 60) / 60
}

var isLikeNumber = function (num) {
   return !isNaN(parseFloat(num)) && isFinite(num)
}

/**
 * Sums an array.
 * @example tiem.sum([1, 2, 3]) => 6
 * @param {Array<Number>} array Array to sum.
 * @returns {Number} Sum.
 */
var sum = function (array) {
   return _.reduce(array, function (sum, num) {
      return sum + (isLikeNumber(num) ? +num : 0)
   })
}

var createObject = _.curry(function(key, value){return _.zipObject([key], [value])})

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

/**
 * Uses an array of array structure to create constants.
 * @example tiem.constants([['yep', 'yay!'], ['nope']]) => {yep: _.constant('yay!'), nope: _.constant('nope')}
 * @param {Array<Object>} array Array of arrays which map to object.
 * @param {<Object>}
 */
var constants = zipObjectT(_.first, _.compose(_.constant, _.last))


/**
 * Determine if pairs (object, string) has object key name.
 * @example have([[{item: ''}, 'item'], [{item2: ''}, 'item2']]) => true
 * @param {Array<Object, String>} objects Objects to test for key values.
 * @returns {Boolean} True if all have correct key values else false.
 */
var have =
    _.compose(
        _.all,
        _.partialRight(
            _.map, function (a) {
               return _.has(_.first(a), _.last(a))
            }))
//https://github.com/antris/js-polymorphism/blob/master/feed/feed.js
var hasAll = _.curry(function(attrs, o){
   var has = _.curry(_.has)
   return _.every(attrs, has(o))
})


var isEqual = _.curry(_.isEqual, 2)

var isSomething = complement(_.isEmpty)

var isSomeString = function(s){
   return isSomething(s) && _.isString(s)
}

var mapWith = b.flip(_.curry(_.map))

var not = complement(_.identity)

var hasDeep = b.flip(_.compose(not, _.isEmpty, _.curry(_.findKey, 2)))
//var hasDeep = _.compose(not, _.isEmpty, _.rcurry2(_.findKey))

// Append/prepend to new array
var concat = _.curry(function(a, b){
   return _.isArray(a) ? a.concat(b) : b.concat(a)
})

//Lodash function changed for single item
var invokeNow = function(methodName, value, args){
   var isFunc = typeof methodName == 'function',
       func = isFunc ? methodName : (value != null && value[methodName]),
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
   return b.isOption(option) ? option.fold(predicate, true) : false
})

t = t
   .property('isWholeNumber', isWholeNumber)
   .property('areUniqueNow', areUniqueNow)
   .property('areUnique', areUnique)
   .property('toFlatArray', toFlatArray)
   .property('complement', complement)
   .property('addRollingArray', addRollingArray)
   .property('fractionalHours', fractionalHours)
   .property('isLikeNumber', isLikeNumber)
   .property('sum', sum)
   .property('zipObjectT', zipObjectT)
   .property('constants', constants)
   .property('have', have)
   .property('hasAll', hasAll)
   .property('isEqual', isEqual)
   .property('createObject', createObject)
   .property('isSomething', isSomething)
   .property('isSomeString', isSomeString)
   .property('mapWith', mapWith)
   .method('not', _.isBoolean, not)
   .property('hasDeep', hasDeep)
   .property('invoke', invoke)
   .property('isArrayOf', isArrayOf)
