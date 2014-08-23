// Generated by LiveScript 1.2.0
var t, _, Option, lens;
t = require('./../utilities/utilities-objects');
_ = require('./../../node_modules/lodash/lodash');
Option = require('./../../node_modules/fantasy-options/option');
lens = require('./../../node_modules/fantasy-lenses/lens').Lens.objectLens;
describe('How the utilities are used in project:', function(){
  var o, objects, option, sexyLens, name, first, idLens, firstName;
  o = {
    name: {
      first: 'Jon',
      last: 'Nyman'
    },
    sex: 'M'
  };
  objects = [
    {
      id: 0,
      name: 'Jon'
    }, {
      id: 1,
      name: 'Laura'
    }
  ];
  option = Option.Some(o);
  sexyLens = lens('sex');
  name = lens('name');
  first = lens('first');
  idLens = lens('id');
  firstName = name.andThen(first);
  describe('The function `getNow`', function(){
    var x$;
    x$ = it;
    x$('should get the specified value pair', function(){
      expect(t.getNow(sexyLens, o)).toEqual('M');
      expect(t.getNow(name.andThen(first), o)).toEqual('Jon');
    });
    x$('should have curried version `get`', function(){
      expect(t.get(sexyLens)(o)).toEqual('M');
    });
  });
  describe('The function `setNow`', function(){
    var x$;
    x$ = it;
    x$('should set the specified object without changing the original', function(){
      expect(t.setNow(sexyLens, o, 'F')).toEqual({
        name: {
          first: 'Jon',
          last: 'Nyman'
        },
        sex: 'F'
      });
      expect(o).toEqual({
        name: {
          first: 'Jon',
          last: 'Nyman'
        },
        sex: 'M'
      });
    });
    x$('should have curried version `set`', function(){
      expect(t.set(sexyLens)(o)('F')).toEqual({
        name: {
          first: 'Jon',
          last: 'Nyman'
        },
        sex: 'F'
      });
    });
  });
  describe('The function `toOption`', function(){
    var x$;
    x$ = it;
    x$('should return None when value is empty', function(){
      expect(t.toOption(void 8)).toEqual(Option.None);
      expect(t.toOption(null)).toEqual(Option.None);
    });
    x$('should return Some when value is something', function(){
      expect(t.toOption(7)).toEqual(Option.Some(7));
    });
  });
  describe('The function `filterByLensNow`', function(){
    var x$;
    x$ = it;
    x$('should return first object with specified lens value as option', function(){
      expect(t.filterByLensNow(idLens, objects, 0)).toEqual(Option.Some({
        id: 0,
        name: 'Jon'
      }));
      expect(t.filterByLens(idLens, objects)(1)).toEqual(Option.Some({
        id: 1,
        name: 'Laura'
      }));
    });
  });
  describe('The function `xAddToList`', function(){
    var x$;
    x$ = it;
    x$('should return new list with replaced object', function(){
      expect(t.xAddToList(idLens, Option.Some({
        id: 1,
        name: 'Millie'
      }), objects)).toEqual([
        {
          id: 0,
          name: 'Jon'
        }, {
          id: 1,
          name: 'Millie'
        }
      ]);
    });
  });
  describe('The function `setOption`', function(){
    var x$;
    x$ = it;
    x$('should set item in option', function(){
      expect(t.setOption(firstName, option, {
        first: 'Adalida'
      })).toEqual(Option.Some({
        name: {
          first: 'Adalida',
          last: 'Nyman'
        },
        sex: 'M'
      }));
      expect(option).toEqual(Option.Some(o));
    });
  });
});