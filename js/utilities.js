/**
 * Created by jon on 2/13/14.
 */

/*jslint asi: true*/
/* global _ */

/**
 * Constructors for objects
 * @type {Object}
 */
function Tiem() {}
Tiem.O = function () {}
Tiem.Settings = function () {}

/**
 * Contains useful functions for general use.
 **Utilities**
 */

/**
 * Takes an object and returns a string of specified length or less, trimmed.
 * @param {String} string String to clean and resize.
 * @param {Number} size Integer to resize string to.
 * @returns {String} New string which has been trimmed and resized.
 */
Tiem.stringSize = function (string, size) {
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
Tiem.isWholeNumber = function (number) {
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
Tiem.isBetween = function (lower, upper, value) {
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
Tiem.areUnique = function (objects, property) {
    'use strict';
    if (_.isEmpty(objects)) {
        return false
    }
    var objectProperties = _.map(objects, property)
    return _.isEqual(_.uniq(objectProperties).length, objects.length)
}

/**
 * Determine if key has unique values for an array of objects
 * @example Tiem.areUniqueValues('myKey')([{key1: 1}, {key1: 2}]) => true
 * @param {String} key Key value to test.
 * @returns {Function} Function which takes an array of objects.
 */
Tiem.areUniqueValues = function (key) {
    return _.partialRight(Tiem.areUnique, key)
}

/**
 * Converts to array then flattens results.
 * @param {Object} object Object to put in flattened array.
 * @returns {Array<Object>} Flattened array of objects.
 */
Tiem.toFlatArray = _.compose(_.flatten, _.toArray)

/**
 * Takes complement of a function.
 * @param {function(*):Boolean} predicate Function which returns a boolean.
 * @returns {function(*):Boolean} Function which returns the opposite of the original value.
 * @author Michael Fogus see: https://github.com/funjs/book-source
 */
Tiem.complement = function (predicate) {
    return function () {
        return !predicate.apply(null, _.toArray(arguments))
    }
}

/**
 * Adds a fraction value to array between two values.
 * @example Tiem.addRollingArray([0, 0, 0, 0], 1.5, 4, 1) -> [0, 0.5, 1, 1]
 * @param {Array<Number>} array Original array values.
 * @param {Number} start Start index to begin can be fraction.
 * @param {Number} end End index to begin, can be be fraction.
 * @param {Number} fraction Value to add to array index, if at end or beginning will take the fraction of the value.
 * @returns {Array<Number>} a new array with added values.
 */
Tiem.addRollingArray = function (array, start, end, fraction) {
    return _.map(array, function (value, index) {
        if (Math.floor(start) === Math.floor(end) && index === Math.floor(start)) {
            return fraction * (end - start) + value
        } else if (Math.floor(start) <= index && index <= Math.floor(end)) {
            if (Math.floor(start) === index) {
                return fraction * (1 + index - start) + value
            } else if (Math.floor(end) === index) {
                return fraction * (end - index) + value
            } else {
                return fraction + value
            }
        } else {
            return value
        }
    })
}

/**
 * @param {Date} date Date/Time to convert to fractions of hours.
 * @returns {Number} Fractional representation of hours.
 */
Tiem.fractionalHours = function (date) {
    return date.getHours() + (date.getMinutes() + date.getSeconds() / 60) / 60
}

Tiem.isLikeNumber = function (num) {
    return !isNaN(parseFloat(num)) && isFinite(num)
}

/**
 * Sums an array.
 * @example Tiem.sum([1, 2, 3]) => 6
 * @param {Array<Number>} array Array to sum.
 * @returns {Number} Sum.
 */
Tiem.sum = function (array) {
    return _.reduce(array, function (sum, num) {
        return sum + (Tiem.isLikeNumber(num) ? +num : 0)
    })
}

/**
 * Zips array of objects with functions.
 * @example Tiem.zipObjectT(['Hello'], _.identity, function(){return ', world!'}) => {Hello: ', world!'}
 * @param {Array<Object>} array Array of objects to map and zip.
 * @param {function(<Object>)} funcKey Function which acts on key value of object.
 * @param {function(<Object>)} funcValue Function which act on value of the object.
 * @returns {<Object>} Returns an object.
 */
Tiem.zipObjectT = _.curry(function (funcKey, funcValue, array) {
    return _.zipObject(_.map(array, funcKey), _.map(array, funcValue))
})

/**
 * Uses an array of array structure to create constants.
 * @example Tiem.constants([['yep', 'yay!'], ['nope']]) => {yep: _.constant('yay!'), nope: _.constant('nope')}
 * @param {Array<Object>} array Array of arrays which map to object.
 * @param {<Object>}
 */
Tiem.constants = Tiem.zipObjectT(_.first, _.compose(_.constant, _.last))

//Tiem.zipObjectFunction(_.constant)

/**
 * Determine if pairs (object, string) has object key name.
 * @example Tiem.have([[{item: ''}, 'item'], [{item2: ''}, 'item2']]) => true
 * @param {Array<Object, String>} objects Objects to test for key values.
 * @returns {Boolean} True if all have correct key values else false.
 */
Tiem.have =
    _.compose(
        _.all,
        _.partialRight(
            _.map, function (a) {
                return _.has(_.first(a), _.last(a))
            }))