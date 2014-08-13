// 
// describe("How the utilities are used in project", function () {
//    //isWholeNumber
//    it('should return true when a whole number is given', function () {
//       //expect(void 0).toBe(void 0)
// //      expect(t.isWholeNumber(3)).toBe(true)
//    })
// })


// var
//    t = require('./../utilities/utilities.js')
//   _ = require('./../../node_modules/lodash/lodash')


//    .property('isLikeNumber', isLikeNumber)
//    .property('sum', sum)
//    .property('zipObjectT', zipObjectT)
//    .property('have', have)
//    .property('hasAll', hasAll)
//    .property('isEqual', isEqual)
//    .property('isSomething', isSomething)
//    .property('isSomeString', isSomeString)
//    .property('mapWith', mapWith)
//    .method('not', _.isBoolean, not)
//    .property('invoke', invoke)
//    .property('isArrayOf', isArrayOf)
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


// describe("How the utilities are used in project", function () {
//    //isWholeNumber
//    it('should return true when a whole number is given', function () {
//       //expect(void 0).toBe(void 0)
// //      expect(t.isWholeNumber(3)).toBe(true)
//    })
//    it('should return false when given number which is not a whole number', function () {
//       expect(t.isWholeNumber(3.14)).toEqual(false)
//    })
//    it('should return false when given an item which is not a number', function () {
//       expect(t.isWholeNumber('3')).toEqual(false)
//    })
//    //areUnique
//    it('should determine if the values in an object array are unique', function () {
//       var uniqueObject = [{
//          dogName: 'Lassie',
//          color: 'multi'
//       }]
//       var uniqueObjects = [{
//          dogName: 'Lassie',
//          color: 'multi'
//       }, {
//          dogName: 'Hassie',
//          color: 'brown'
//       }]
//       var notUniqueObjects = [{
//          dogName: 'Lassie',
//          color: 'multi'
//       }, {
//          dogName: 'Lassie',
//          color: 'brown'
//       }]
// 
//       expect(t.areUniqueNow('dogName', uniqueObject)).toBe(true)
//       expect(t.areUniqueNow('dogName', uniqueObjects)).toBe(true)
//       expect(t.areUniqueNow('dogName', notUniqueObjects)).not.toBe(true)
//    })
//    it('should convert arguments to array and flatten array', function () {
//       var test = function () {
//          return t.toFlatArray(arguments)
//       }
//       expect(test(1, [2])).toEqual([1, 2])
//    })
//    it('should negate a function.', function () {
//       var isNotString = t.complement(_.isString)
//       expect(isNotString(0)).toBe(true)
//       expect(isNotString('s')).toBe(false)
//    })
//    describe("The function addRollingArray", function () {
//       var array = [0.5, 0, 0, 0]
//       it('should add rolling values to an array from beginning through the last index', function () {
//          expect(t.addRollingArray(array, 1.5, 4, 1)).toEqual([0.5, 0.5, 1, 1])
//       })
//       it('should do partial adding at the beginning and end of the array when start and end are not integers', function () {
//          expect(t.addRollingArray(array, 1.5, 3.5, 1)).toEqual([0.5, 0.5, 1, 0.5])
//       })
//       it('should add to previous values when within start and end values and be able to add full value to beginning of an array', function () {
//          var array2 = _.clone(array);
//          array2.push(5);
//          array2[0] = 2
//          expect(t.addRollingArray(array2, 0, 3.5, 1)).toEqual([3, 1, 1, 0.5, 5])
//       })
//       it('should add the difference of the starting and ending points when they are on the same index', function () {
//          expect(t.addRollingArray(array, 0, 0.25, 1)).toEqual([0.75, 0, 0, 0])
//       })
//    })
//    describe("fractionalHours", function () {
//       it('should convert a date to a fractional hour value down to the seconds', function () {
//          expect(t.fractionalHours(new Date(2014, 3, 6, 15, 15, 36))).toEqual(15.26)
//       })
//    })
//    describe("sum", function () {
//       it("should add the elements in an array", function () {
//          expect(t.sum([1, 2, 3])).toEqual(6)
//       })
//       it("should reject elements which are not numbers", function () {
//          expect(t.sum([1, 2, '3', 'a'])).toEqual(6)
//       })
//    })
//    describe("The function areUnique", function () {
//       it("should return a function which evaluates an array of objects given a certain key - true when all unique", function () {
//          expect(t.areUnique('myKey')([{
//             myKey: 1
//          }, {
//             myKey: 2
//          }])).toBe(true)
//       })
//       it("should return a function which evaluates an array of objects given a certain key - false when not unique", function () {
//          expect(t.areUnique('myKey')([{
//             myKey: 2
//          }, {
//             myKey: 2
//          }])).toBe(false)
//       })
//    })
//    describe("The function zipObjectT", function () {
//       it("should map an array to a key and value functions and return an object", function () {
//          expect(t.zipObjectT(_.identity, function () {
//             return ', world!'
//          }, ['Hello'])).toEqual({
//             Hello: ', world!'
//          })
//       })
//    })
//    describe('The function hasAll', function(){
//       var o = {id:0,key1:'some value'}
//       it('should be true when all specified keys are true', function(){
//          expect(t.hasAll(['id','key1'])(o)).toBe(true)
//       })
//       it('should be false when all specified keys are not in object', function(){
//          expect(t.hasAll(['id','key1','key2'])(o)).toBe(false)
//       })
//    })
//    describe('The function isNonEmpty', function(){
//       it('should return true when it has a value', function(){
//          expect(t.isSomething('a')).toBe(true)
//       })
//       it('should return false when it is empty', function(){
//          expect(t.isSomething('')).toBe(false)
//       })
//    })
//    describe('The function isSomeString', function(){
//       it('should return true when there is a string of length greater than 0', function(){
//          expect(t.isSomeString('1')).toBe(true)
//       })
//       it("should return false when there isn't a string of length greater than 0", function(){
//          expect(t.isSomeString('')).toBe(false)
//       })
//    })
//    describe('The function not', function(){
//       it('should return false when given true', function(){
//          expect(t.not(true)).toBe(false)
//       })
//       it('should return true when given false', function(){
//          expect(t.not(false)).toBe(true)
//       })
//    })
// 
//    describe('The function invoke', function(){
//       it('should invoke a method with a single argument', function(){
//          expect(t.invoke('toLowerCase')('HELLO')).toEqual('hello')
//          expect(t.invoke('toLowerCase')('HELLO')).not.toEqual('Hello')
//       })
//    })
//    describe('The function isLikeNumber', function(){
//       it('should determine if the string is a number', function(){
//          expect(t.isLikeNumber('7')).toBe(true)
//          expect(t.isLikeNumber('k')).toBe(false)
//       })
//    })
//    describe('The function flip', function(){
//       it('should flip the first two arguments of a function', function(){
//          var test = function(a, b){
//             return a/b
//          }
//          expect(t.flip(test)(1)(4)).toEqual(4)
//          expect(t.flip(test)(4)(1)).toEqual(1/4)
//       })
//    })
// //    describe('The function isArrayOf', function(){
// //       var O = b.tagged('O', ['o'])
// //       var F = b.tagged('F', ['f'])
// //       var aO = [O('hi'), O('bye')]
// //       it('should return true when array contains only what predicate describes as true', function(){
// //          expect(t.isArrayOf(b.isInstanceOf(O))(aO)).toBe(true)
// //       })
// //       it('should return false when array contains falsy object that predicate describes as false', function(){
// //          expect(t.isArrayOf(b.isInstanceOf(O))(aO.concat(F('doh!')))).toBe(false)
// //       })
// //    })
//    describe('The function isOptionOf', function(){
//       
//    })
// })
