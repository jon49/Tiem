t = require './../utilities/utilities'
_ = require './../../node_modules/lodash/lodash'
helpers = require './../../node_modules/fantasy-helpers/fantasy-helpers'
Option = require './../../node_modules/fantasy-options/option'

describe 'How the utilities are used in project:', !->
   describe 'The function isWholeNumber', !-> ``it``
      .. 'should return true when a whole number is given', !-> 
         (expect t.isWholeNumber 3).toBe true
      .. 'should return false when given number which is not a whole number', !-> 
         (expect t.isWholeNumber 3.14).toEqual false    
      .. 'should return false when given an item which is not a number', !-> 
         (expect t.isWholeNumber '3').toEqual false

   describe 'The function toFlatArray', !-> ``it``
      .. 'should convert arguments to array and flatten array', !-> 
         test = -> t.toFlatArray arguments
         (expect test 1, [2]).toEqual [1, 2]

   describe 'The function complement', !-> ``it`` 
      .. 'should negate a function.', !-> 
         isNotString = t.complement _.isString 
         (expect isNotString 0).toBe true 
         (expect isNotString 's').toBe false

   describe 'The function flip', !-> ``it``
      .. 'should reverse 2 arguments', !->
         test = t.flip ((a, b) -> a / b)
         (expect (test 1) 2).toEqual 2
         (expect (test 2) 1).toEqual 1/2

   describe 'The function sum', !-> ``it``
      .. 'should add the elements in an array', !->
       (expect t.sum [ 1 2 3 ]).toEqual 6
      .. 'should reject elements which are not numbers', !->
       (expect t.sum [ 1 2 '3' 'a' ]).toEqual 6

   describe 'The function zipObjectT', !-> ``it``
      .. 'should map an array to a key and value functions and return an object', !->
         (expect t.zipObjectT _.identity, (-> ', world!'), ['Hello']).toEqual {Hello: ', world!'}

   describe 'The function not', !-> ``it``
     .. 'should return false when given true', !-> (expect t.not true).toBe false
     .. 'should return true when given false', !-> (expect t.not false).toBe true

   describe 'The function invoke', !-> ``it``
      .. 'should invoke a method with a single argument', !->
       (expect (t.invoke 'toLowerCase') 'HELLO').toEqual 'hello'
       (expect (t.invoke 'toLowerCase') 'HELLO').not.toEqual 'Hello'

   describe 'The function isLikeNumber', !-> ``it``
     .. 'should determine if the string is a number', !->
       (expect t.isLikeNumber '7').toBe true
     .. 'should determine if the string is not a number', !->
       (expect t.isLikeNumber 'k').toBe false

   describe 'The function isArrayOf', !-> ``it``
      .. 'should determine if array is all single type', !->
         a = [ 1 2 3 4 ]
         (expect (t.isArrayOf _.isNumber) a).toBe true
      .. 'should determine if array is not all a single type', !->
         b = [ 1 2 3 'a' ]
         (expect (t.isArrayOf _.isNumber) b).toBe false

   describe 'The function isOptionOf', !-> ``it``
      isOptionOfNumber = t.isOptionOf _.isNumber
      .. 'should return true when it is an option of specified type', !->
         some = Option.Some 1
         (expect isOptionOfNumber some).toBe true
      .. 'should return true when it is an option of none', !->
         none = Option.None
         (expect isOptionOfNumber none).toBe true
      .. 'should return false when it is not an option', !->
         any = 1
         (expect isOptionOfNumber any).toBe false
      .. 'should return false when it is an option but not the right type', !->
         someBadType = Option.Some 'I am a string'
         (expect isOptionOfNumber someBadType).toBe false

   describe 'The function isOption', !-> ``it``
      .. 'should determine that Option.Some is of type Option', !->
         some = Option.Some 1
         (expect t.isOption some).toBe true
      .. 'should determine that Option.None is of type Option', !->
         none = Option.None
         (expect t.isOption none).toBe true
      .. 'should determine that a string is not type Option', !->
         (expect t.isOption 'Not an option').toBe false

   describe 'The function isSome', !-> ``it``
      .. 'should determine that Option.Some is of type Some', !->
         some = Option.Some 1
         (expect t.isSome some).toBe true
      .. 'should determine that Option.None is not of type Some', !->
         none = Option.None
         (expect t.isSome none).toBe false
      .. 'should determine that a string is not type Some', !->
         (expect t.isSome 'Not an option').toBe false

   describe 'The function isNone', !-> ``it``
      .. 'should determine that Option.None is not of type None', !->
         some = Option.Some 1
         (expect t.isNone some).toBe false
      .. 'should determine that Option.None is of type None', !->
         none = Option.None
         (expect t.isNone none).toBe true
      .. 'should determine that a string is not type None', !->
         (expect t.isNone 'Not an option').toBe false

   describe 'The function `tagged`', !-> ``it``
      .. 'should return plain object with ctor key/value', !->
         Person = t.tagged 'Person', ['id', 'first', 'last', 'age'], [0, 'Jon', 'Nyman', 30]
         (expect Person(0, 'George', 'Henry', 31)).toEqual {id: 0, first: 'George', last: 'Henry', age: 31, ctor: 'Person'}
      .. 'should return plain object with defaults returned for None/undefined', !->
         Person = t.tagged 'Person', ['id', 'first', 'last', 'age'], [0, 'Jon', 'Nyman', 30]
         (expect Person(0, void, null, Option.None)).toEqual {id: 0, first: 'Jon', last: null, age: 30, ctor: 'Person'}
      .. 'should return plain object with None/undefined values for functions', !->
         Person = t.tagged 'Person', ['id', 'first', 'last', 'age'], [0, 'Jon', 'Nyman', -> 30]
         (expect Person(0, 'George', 'Henry', Option.None)).toEqual {id: 0, first: 'George', last: 'Henry', age: 30, ctor: 'Person'}

   describe 'The function `isObjectNamed`', !-> ``it``
      Person = t.tagged 'Person', ['id', 'first', 'last', 'age'], [0, 'Jon', 'Nyman', 30]
      george = Person 0, 'George', 'Henry', 20
      .. 'should return true when plain object\'s key `ctor` is the same name', !->
         (expect t.isObjectNamed 'Person', george).toBe true
      .. 'should return false when plain object\'s key `ctor` is a different name', !->
         (expect t.isObjectNamed 'George', george).toBe false
      .. 'should return true when plain object\'s key `ctor` is the same name and when curried', !->
         (expect (t.isObjectNamed 'Person') george).toBe true

   describe 'The function `identifiers`', !-> ``it``
      .. 'should determine if the arguments provided are the same type as the guard array', !->
         (expect (t.identifiers [_.isString, _.isNumber, _.isPlainObject], 'I\'m a string!', 7, {plain: 'object'})).toBe true
         (expect (t.identifiers [_.isString, _.isNumber, _.isPlainObject], 7, 7, {plain: 'object'})).toBe false

   describe 'The function `error`', !-> ``it``
      .. 'should throw error', !->
         (expect (t.error('Throw me!'))).toThrow 'Throw me!'

   describe 'The function `implement`', !-> ``it``
      .. 'should return array of arguments when identifiers are correct', !->
         (expect (t.implement [_.isString], 'string')).toEqual ['string']
      .. 'should throw error when incorrect argument is given', !->
         (expect ( !-> (t.implement [_.isString], 7))).toThrow 'Method not implemented for this input.'
      .. 'should be able to be curried', !->
         (expect ((t.implement [_.isString]) 'string')).toEqual ['string']

   describe 'The function `apply`', !-> ``it``
      .. 'should apply the given function to the given array of arguments', !->
         (expect (t.apply ((a, b) -> a + b), [15, 16])).toBe 31
      .. 'should be curried', !->
         (expect ((t.apply ((a, b) -> a + b)) [15, 16])).toBe 31

   describe 'The function `guardedCurry`', !-> ``it``
      f = (a, b) -> a + b
      .. 'should make a function curried and create a guard on the arguments', !->
         (expect (t.guardedCurry f, [t.isWholeNumber, t.isWholeNumber], 2)(2)(3)).toBe 5
      .. 'should throw error when incorrect input is given', !->
         (expect ( !-> (t.guardedCurry f, [t.isWholeNumber, t.isWholeNumber], 2)('This is a string.')(3))).toThrow 'Method not implemented for this input.'

   describe 'The function `isSingletonOf`', !-> ``it``
      .. 'should determine if the singleton is of the correct type', !->
         singleton = {key: 'value'}
         (expect (t.isSingletonOf 'key', _.isString, singleton)).toBe true
         (expect (t.isSingletonOf 'key', _.isNumber, singleton)).toBe false

   describe 'The function `zipObjectArray`', !-> ``it``
      .. 'should zip an array and turn it into an object', !->
         (expect t.zipObjectArray ['comment' 'other']).toEqual (
            comment: 'comment'
            other: 'other'
         )
