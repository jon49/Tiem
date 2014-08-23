// Generated by LiveScript 1.2.0
var t, _, helpers, Option;
t = require('./../utilities/utilities');
_ = require('./../../node_modules/lodash/lodash');
helpers = require('./../../node_modules/fantasy-helpers/fantasy-helpers');
Option = require('./../../node_modules/fantasy-options/option');
describe('How the utilities are used in project:', function(){
  describe('The function isWholeNumber', function(){
    var x$;
    x$ = it;
    x$('should return true when a whole number is given', function(){
      expect(t.isWholeNumber(3)).toBe(true);
    });
    x$('should return false when given number which is not a whole number', function(){
      expect(t.isWholeNumber(3.14)).toEqual(false);
    });
    x$('should return false when given an item which is not a number', function(){
      expect(t.isWholeNumber('3')).toEqual(false);
    });
  });
  describe('The function toFlatArray', function(){
    var x$;
    x$ = it;
    x$('should convert arguments to array and flatten array', function(){
      var test;
      test = function(){
        return t.toFlatArray(arguments);
      };
      expect(test(1, [2])).toEqual([1, 2]);
    });
  });
  describe('The function complement', function(){
    var x$;
    x$ = it;
    x$('should negate a function.', function(){
      var isNotString;
      isNotString = t.complement(_.isString);
      expect(isNotString(0)).toBe(true);
      expect(isNotString('s')).toBe(false);
    });
  });
  describe('The function flip', function(){
    var x$;
    x$ = it;
    x$('should reverse 2 arguments', function(){
      var test;
      test = t.flip(function(a, b){
        return a / b;
      });
      expect(test(1)(2)).toEqual(2);
      expect(test(2)(1)).toEqual(1 / 2);
    });
  });
  describe('The function sum', function(){
    var x$;
    x$ = it;
    x$('should add the elements in an array', function(){
      expect(t.sum([1, 2, 3])).toEqual(6);
    });
    x$('should reject elements which are not numbers', function(){
      expect(t.sum([1, 2, '3', 'a'])).toEqual(6);
    });
  });
  describe('The function zipObjectT', function(){
    var x$;
    x$ = it;
    x$('should map an array to a key and value functions and return an object', function(){
      expect(t.zipObjectT(_.identity, function(){
        return ', world!';
      }, ['Hello'])).toEqual({
        Hello: ', world!'
      });
    });
  });
  describe('The function not', function(){
    var x$;
    x$ = it;
    x$('should return false when given true', function(){
      expect(t.not(true)).toBe(false);
    });
    x$('should return true when given false', function(){
      expect(t.not(false)).toBe(true);
    });
  });
  describe('The function invoke', function(){
    var x$;
    x$ = it;
    x$('should invoke a method with a single argument', function(){
      expect(t.invoke('toLowerCase')('HELLO')).toEqual('hello');
      expect(t.invoke('toLowerCase')('HELLO')).not.toEqual('Hello');
    });
  });
  describe('The function isLikeNumber', function(){
    var x$;
    x$ = it;
    x$('should determine if the string is a number', function(){
      expect(t.isLikeNumber('7')).toBe(true);
    });
    x$('should determine if the string is not a number', function(){
      expect(t.isLikeNumber('k')).toBe(false);
    });
  });
  describe('The function isArrayOf', function(){
    var x$;
    x$ = it;
    x$('should determine if array is all single type', function(){
      var a;
      a = [1, 2, 3, 4];
      expect(t.isArrayOf(_.isNumber)(a)).toBe(true);
    });
    x$('should determine if array is not all a single type', function(){
      var b;
      b = [1, 2, 3, 'a'];
      expect(t.isArrayOf(_.isNumber)(b)).toBe(false);
    });
  });
  describe('The function isOptionOf', function(){
    var x$, isOptionOfNumber;
    x$ = it;
    isOptionOfNumber = t.isOptionOf(_.isNumber);
    x$('should return true when it is an option of specified type', function(){
      var some;
      some = Option.Some(1);
      expect(isOptionOfNumber(some)).toBe(true);
    });
    x$('should return true when it is an option of none', function(){
      var none;
      none = Option.None;
      expect(isOptionOfNumber(none)).toBe(true);
    });
    x$('should return false when it is not an option', function(){
      var any;
      any = 1;
      expect(isOptionOfNumber(any)).toBe(false);
    });
    x$('should return false when it is an option but not the right type', function(){
      var someBadType;
      someBadType = Option.Some('I am a string');
      expect(isOptionOfNumber(someBadType)).toBe(false);
    });
  });
  describe('The function isOption', function(){
    var x$;
    x$ = it;
    x$('should determine that Option.Some is of type Option', function(){
      var some;
      some = Option.Some(1);
      expect(t.isOption(some)).toBe(true);
    });
    x$('should determine that Option.None is of type Option', function(){
      var none;
      none = Option.None;
      expect(t.isOption(none)).toBe(true);
    });
    x$('should determine that a string is not type Option', function(){
      expect(t.isOption('Not an option')).toBe(false);
    });
  });
  describe('The function isSome', function(){
    var x$;
    x$ = it;
    x$('should determine that Option.Some is of type Some', function(){
      var some;
      some = Option.Some(1);
      expect(t.isSome(some)).toBe(true);
    });
    x$('should determine that Option.None is not of type Some', function(){
      var none;
      none = Option.None;
      expect(t.isSome(none)).toBe(false);
    });
    x$('should determine that a string is not type Some', function(){
      expect(t.isSome('Not an option')).toBe(false);
    });
  });
  describe('The function isNone', function(){
    var x$;
    x$ = it;
    x$('should determine that Option.None is not of type None', function(){
      var some;
      some = Option.Some(1);
      expect(t.isNone(some)).toBe(false);
    });
    x$('should determine that Option.None is of type None', function(){
      var none;
      none = Option.None;
      expect(t.isNone(none)).toBe(true);
    });
    x$('should determine that a string is not type None', function(){
      expect(t.isNone('Not an option')).toBe(false);
    });
  });
  describe('The function `tagged`', function(){
    var x$;
    x$ = it;
    x$('should return plain object with ctor key/value', function(){
      var Person;
      Person = t.tagged('Person', ['id', 'first', 'last', 'age'], [0, 'Jon', 'Nyman', 30]);
      expect(Person(0, 'George', 'Henry', 31)).toEqual({
        id: 0,
        first: 'George',
        last: 'Henry',
        age: 31,
        ctor: 'Person'
      });
    });
    x$('should return plain object with defaults returned for None/undefined', function(){
      var Person;
      Person = t.tagged('Person', ['id', 'first', 'last', 'age'], [0, 'Jon', 'Nyman', 30]);
      expect(Person(0, void 8, null, Option.None)).toEqual({
        id: 0,
        first: 'Jon',
        last: null,
        age: 30,
        ctor: 'Person'
      });
    });
    x$('should return plain object with None/undefined values for functions', function(){
      var Person;
      Person = t.tagged('Person', ['id', 'first', 'last', 'age'], [
        0, 'Jon', 'Nyman', function(){
          return 30;
        }
      ]);
      expect(Person(0, 'George', 'Henry', Option.None)).toEqual({
        id: 0,
        first: 'George',
        last: 'Henry',
        age: 30,
        ctor: 'Person'
      });
    });
  });
  describe('The function `isObjectNamed`', function(){
    var x$, Person, george;
    x$ = it;
    Person = t.tagged('Person', ['id', 'first', 'last', 'age'], [0, 'Jon', 'Nyman', 30]);
    george = Person(0, 'George', 'Henry', 20);
    x$('should return true when plain object\'s key `ctor` is the same name', function(){
      expect(t.isObjectNamed('Person', george)).toBe(true);
    });
    x$('should return false when plain object\'s key `ctor` is a different name', function(){
      expect(t.isObjectNamed('George', george)).toBe(false);
    });
    x$('should return true when plain object\'s key `ctor` is the same name and when curried', function(){
      expect(t.isObjectNamed('Person')(george)).toBe(true);
    });
  });
  describe('The function `identifiers`', function(){
    var x$;
    x$ = it;
    x$('should determine if the arguments provided are the same type as the guard array', function(){
      expect(t.identifiers([_.isString, _.isNumber, _.isPlainObject], 'I\'m a string!', 7, {
        plain: 'object'
      })).toBe(true);
      expect(t.identifiers([_.isString, _.isNumber, _.isPlainObject], 7, 7, {
        plain: 'object'
      })).toBe(false);
    });
  });
  describe('The function `error`', function(){
    var x$;
    x$ = it;
    x$('should throw error', function(){
      expect(t.error('Throw me!')).toThrow('Throw me!');
    });
  });
  describe('The function `implement`', function(){
    var x$;
    x$ = it;
    x$('should return array of arguments when identifiers are correct', function(){
      expect(t.implement([_.isString], 'string')).toEqual(['string']);
    });
    x$('should throw error when incorrect argument is given', function(){
      expect(function(){
        t.implement([_.isString], 7);
      }).toThrow('Method not implemented for this input.');
    });
    x$('should be able to be curried', function(){
      expect(t.implement([_.isString])('string')).toEqual(['string']);
    });
  });
  describe('The function `apply`', function(){
    var x$;
    x$ = it;
    x$('should apply the given function to the given array of arguments', function(){
      expect(t.apply(function(a, b){
        return a + b;
      }, [15, 16])).toBe(31);
    });
    x$('should be curried', function(){
      expect(t.apply(function(a, b){
        return a + b;
      })([15, 16])).toBe(31);
    });
  });
  describe('The function `guardedCurry`', function(){
    var x$, f;
    x$ = it;
    f = function(a, b){
      return a + b;
    };
    x$('should make a function curried and create a guard on the arguments', function(){
      expect(t.guardedCurry(f, [t.isWholeNumber, t.isWholeNumber], 2)(2)(3)).toBe(5);
    });
    x$('should throw error when incorrect input is given', function(){
      expect(function(){
        t.guardedCurry(f, [t.isWholeNumber, t.isWholeNumber], 2)('This is a string.')(3);
      }).toThrow('Method not implemented for this input.');
    });
  });
  describe('The function `isSingletonOf`', function(){
    var x$;
    x$ = it;
    x$('should determine if the singleton is of the correct type', function(){
      var singleton;
      singleton = {
        key: 'value'
      };
      expect(t.isSingletonOf('key', _.isString, singleton)).toBe(true);
      expect(t.isSingletonOf('key', _.isNumber, singleton)).toBe(false);
    });
  });
});