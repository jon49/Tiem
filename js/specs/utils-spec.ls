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


#  .property('identifiers', identifiers)
#  .method(
#     'tagged',
#     identifiers([_.isString, _.isArray, _.isArray]),
#     tagged
#  )
#  .method(
#     'isObjectNamed',
#     identifiers([_.isString, _.isPlainObject]),
#     isObjectNamed
#  )
