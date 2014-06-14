/**
 * Created by jon on 2/13/14.
 */

/*jslint asi: true*/
/*jshint indent:3, curly:false, laxbreak:true */
/* global _ */

/**
 * Contains useful functions for general use.
 **Utilities**
 */

var b = bilby
var t = b.environment()

var f = function(func){
   var funcArray = func.split('->')
   return   (funcArray.length === 1)
            ? new Function('x', 'return (' + funcArray[0].trim() + ')')
            : new Function(funcArray[0].trim(), 'return (' + funcArray[1].trim() + ')')
}

/**
 * Takes an object and returns a string of specified length or less, trimmed.
 * @param {String} string String to clean and resize.
 * @param {Number} size Integer to resize string to.
 * @returns {String} New string which has been trimmed and resized.
 */
var stringSize = function (string, size) {
   "use strict";
   if (!_.isNumber(size)) {
      throw new Error("stringSize : Not a number!")
   }
   return String(string).trim().slice(0, size)
}

/**
 * Takes a number and determines if it is a whole number.
 * @param {Number} number Number to test.
 * @returns {Boolean} True if whole number otherwise false.
 */
var isWholeNumber = function (number) {
   "use strict";
   if (_.isNumber(number) && (number > -1) && (Math.floor(number) === number)) {
      return true
   }
   return false
}

/**
 * Takes a number and determines if it is equal to or inbetween two other numbers.
 * @param {Number} lower Lower bound to test.
 * @param {Number} upper Upper bound to test.
 * @param {Number} value Number to test.
 * @returns {Boolean} True if between upper & lower bounds, otherwise false.
 */
var isBetween = function (lower, upper, value) {
   "use strict";
   if ((lower <= value) && (value <= upper)) {
      return true
   }
   return false
}

/**
 * Determine if items in object are unique.
 * @param {Array<Object>} objects Objects to test if they are unique.
 * @param {String} property Property name of object to test against.
 * @returns {Boolean} True if unique, otherwise false.
 */
var areUnique = function (objects, property) {
   'use strict';
   if (_.isEmpty(objects)) {
      return false
   }
   var objectProperties = _.map(objects, property)
   return _.isEqual(_.uniq(objectProperties).length, objects.length)
}

/**
 * Determine if key has unique values for an array of objects
 * @example tiem.areUniqueValues('myKey')([{key1: 1}, {key1: 2}]) => true
 * @param {String} key Key value to test.
 * @returns {Function} Function which takes an array of objects.
 */
var areUniqueValues = function (key) {
   return _.partialRight(areUnique, key)
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
      return   (floor(start) === floor(end) && index === floor(start))
                  ? fraction * (end - start) + value
               : (floor(start) <= index && index <= floor(end))
                  ? 
                     ((floor(start) === index) ? fraction * (1 + index - start) + value
                     : (floor(end) === index) ? fraction * (end - index) + value
                     : fraction + value)
               : value
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

var singleTagged = function(type){
   return b.curry(b.tagged(type.replace(/^(.){1}/,'$1'.toUpperCase()), [type]))
}

// combine objects together into new object. any keys which are the same will have an array of values.
var zipOverObject = _.curry(function(object1, object2){
   var o1 = _.cloneDeep(object1)
      o2 = _.cloneDeep(object2),
      a1 = _.keys(o1), a2 = _.keys(o2),
      diff = _.difference(a2, a1),
      inter = _.intersection(a1, a2),
      c1 = _.cloneDeep(o1)
   _.forEach(diff, function(key){
      c1[key] = o2[key]
   })
   _.forEach(inter, function(key){
      c1[key] = (_.isArray(c1[key])) ? c1[key] : [c1[key]]
      c1[key] = c1[key].concat(o2[key])
   })
   return c1
})

var zipOverObjects = _.partialRight(_.reduce, function(acc, o){
   return zipOverObject(acc, o)
})

var isSomething = complement(_.isEmpty)

var isSomeString = function(s){
   return isSomething(s) && _.isString(s)
}

var map = function(func){
   return _.partialRight(_.map, func)
}

var not = complement(_.identity)

var hasDeep = b.flip(_.compose(not, _.isEmpty, _.curry(_.findKey, 2)))
//var hasDeep = _.compose(not, _.isEmpty, _.rcurry2(_.findKey))

// Append/prepend to new array
var concat = _.curry(function(a, b){
   return _.isArray(a) ? a.concat(b) : b.concat(a)
})

//Lodash function changed for single item
var invoke = _.curry(function(methodName, args, value){
   var isFunc = typeof methodName == 'function'
       func = isFunc ? methodName : (value != null && value[methodName])
   return func ? func.apply(value, args) : void 0
})

// Determine if array contains a single object type
var isArrayOf = _.curry(function(fn, a){
   return _.isArray(a) && _.all(a, fn)
})

t = t
   .property('stringSize', stringSize)
   .property('isWholeNumber', isWholeNumber)
   .property('isBetween', isBetween)
   .property('areUnique', areUnique)
   .property('areUniqueValues', areUniqueValues)
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
   .method('singleTagged', isSomeString, singleTagged)
   .method('zipOverObject', function(a, b){return _.isPlainObject(a) && _.isPlainObject(b)}, zipOverObject)
   .method('zipOverObjects', _.isArray, zipOverObjects)
   .property('isSomething', isSomething)
   .property('isSomeString', isSomeString)
   .method('not', _.isBoolean, not)
   .property('hasDeep', hasDeep)
   .property('invoke', invoke)
   .property('isArrayOf', isArrayOf)
