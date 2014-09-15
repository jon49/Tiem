t = require './../utilities/utilities-objects'
_ = require './../../node_modules/lodash/lodash'
Option = require './../../node_modules/fantasy-options/option'
lens = require './../../node_modules/fantasy-lenses/lens' .Lens.objectLens

describe 'How the utilities are used in project:', !->

   o = {name: {first: 'Jon', last: 'Nyman'}, sex: 'M'}
   objects = [{id: 0, name: 'Jon'}, {id: 1, name: 'Laura'}]
   option = Option.Some o
   sexyLens = lens 'sex'
   name = lens 'name'
   first = lens 'first'
   idLens = lens 'id'
   firstName = name.andThen first

   describe 'The function `getNow`', !-> ``it``
      .. 'should get the specified value pair', !->
         (expect t.getNow sexyLens, o).toEqual 'M'
         (expect t.getNow (name.andThen first), o).toEqual 'Jon'
      .. 'should have curried version `get`', !->
         (expect (t.get sexyLens) o).toEqual 'M'

   describe 'The function `setNow`', !-> ``it``
      .. 'should set the specified object without changing the original', !->
         (expect (t.setNow sexyLens, o, {sex: 'F'})).toEqual {name: {first: 'Jon', last: 'Nyman'}, sex: 'F'}
         (expect o).toEqual {name: {first: 'Jon', last: 'Nyman'}, sex: 'M'}
      .. 'should have curried version `set`', !->
         (expect ((t.set sexyLens) o) {sex: 'F'}).toEqual {name: {first: 'Jon', last: 'Nyman'}, sex: 'F'}

   describe 'The function `toOption`', !-> ``it``
      .. 'should return None when value is empty', !->
         (expect t.toOption void).toEqual Option.None
         (expect t.toOption null).toEqual Option.None
      .. 'should return Some when value is something', !->
         (expect t.toOption 7).toEqual Option.Some 7

   describe 'The function `filterByLensNow`', !-> ``it``
      .. 'should return first object with specified lens value as option', !->
         (expect (t.filterByLensNow idLens, objects, 0)).toEqual Option.Some {id: 0, name: 'Jon'}
         (expect ((t.filterByLens idLens, objects) 1)).toEqual Option.Some {id: 1, name: 'Laura'}

   describe 'The function `xAddToList`', !-> ``it``
      .. 'should return new list with replaced object', !->
         (expect (t.xAddToList idLens, {id: 1, name: 'Millie'}, objects)).toEqual [{id: 0, name: 'Jon'}, {id: 1, name: 'Millie'}]
