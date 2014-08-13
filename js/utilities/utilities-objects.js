var 
   _ = require('./../../node_modules/lodash/lodash.js'),
   environment = require('./../../node_modules/fantasy-environment/fantasy-environment')
   lenses = require('./../../node_modules/fantasy-lenses/lens')

// get value by lens
var getNow = function(lens, object){
   return lens.run(object).getter
}

var get = _.curry(getNow)

// set key of object and return a 'new' object
var setNow = function(lens, object, value){
   return lens.run(object).setter(value)
   //return _.create(Object.getPrototypeOf(object), lens.run(object).setter(value))
}
var set = _.curry(setNow)

// wrap an object in an `option`
var toOption = function(thisArg){
   var self = thisArg || this
   return _.isEmpty(self) || _.isEqual(self.self, window) ? b.none : b.some(self)
}

// get an object from an array and wrap in `option`
// example: filterByLensNow(L.list, L.id, 0) => plucked object
var filterByLensNow = function(lens, value, list){
   var list_ = (list || this)
   return toOption(_.first(_.filter(list_, function(o){
      return _.isEqual(getNow(lens, o), value)
   })))
}

// Exclusively add object (unwrapped) to list based on comparator
// example: xAddToList(lensId, someNone, []) => [object] OR []
var xAddToList = function(lens, option, list){
   var list_ = list || this
   return option.fold(function(opt){
      var isSame = isEqual(get(lens, opt))
      return _.reject(list_, function(o){
         return isSame(get(lens, o))
      }).concat(opt)
      }, list_)
}

// set new value in option object
// http://thisisafiller.ghoster.io/notes-on-functional-programming-patterns-for-the-non-mathematician-with-brian-lonsdorf/
// example: over(numberLens, b.constant(2), b.some({number: 1})) => b.some({number: 2})
var overNow = function(lens, fn, thisArg){
   var self = (thisArg || this)
   return set(lens, self, fn.call(null, lens.run(self).getter))
}

var over = _.curry(overNow)

// set property of target to new value
var setOption = _.curry(function(lens, value, option){
   return option.map(function(o){
      return setNow(lens, o, value)
   })
})

// return plain object or empty object
var toObject = function(option){
   return option.getOrElse({})
}

// use lens to get job from list, returns option
var getJobByNow = function(lens, listObject, value){
   return filterByLensNow(lens, value, listObject)
}

var getJobBy = _.curry(getJobByNow)

// use id key to get exclusively add updated job
var xAddJobNow = function(listWrapped, option){
   return xAddToList(L.id, option, getNow(L.list, listWrapped))
}

var xAddJob = _.curry(xAddJobNow)

// replace the old list with updated list
var replaceList = function(fn, object, thisArg){
   var self = thisArg || this
   self.list = fn.call(get(L.list, self), object)
   return self
}

module.exports = environment()
   .method(
      'getNow'
   )   
var getNow = function(lens, object){
   return lens.run(object).getter
}

var get = _.curry(getNow)

// set key of object and return a 'new' object
var setNow = function(lens, object, value){
   return lens.run(object).setter(value)
   //return _.create(Object.getPrototypeOf(object), lens.run(object).setter(value))
}
var set = _.curry(setNow)

// wrap an object in an `option`
var toOption = function(thisArg){
   var self = thisArg || this
   return _.isEmpty(self) || _.isEqual(self.self, window) ? b.none : b.some(self)
}

// get an object from an array and wrap in `option`
// example: filterByLensNow(L.list, L.id, 0) => plucked object
var filterByLensNow = function(lens, value, list){
   var list_ = (list || this)
   return toOption(_.first(_.filter(list_, function(o){
      return _.isEqual(getNow(lens, o), value)
   })))
}

// Exclusively add object (unwrapped) to list based on comparator
// example: xAddToList(lensId, someNone, []) => [object] OR []
var xAddToList = function(lens, option, list){
   var list_ = list || this
   return option.fold(function(opt){
      var isSame = isEqual(get(lens, opt))
      return _.reject(list_, function(o){
         return isSame(get(lens, o))
      }).concat(opt)
      }, list_)
}

// set new value in option object
// http://thisisafiller.ghoster.io/notes-on-functional-programming-patterns-for-the-non-mathematician-with-brian-lonsdorf/
// example: over(numberLens, b.constant(2), b.some({number: 1})) => b.some({number: 2})
var overNow = function(lens, fn, thisArg){
   var self = (thisArg || this)
   return set(lens, self, fn.call(null, lens.run(self).getter))
}

var over = _.curry(overNow)

// set property of target to new value
var setOption = _.curry(function(lens, value, option){
   return option.map(function(o){
      return setNow(lens, o, value)
   })
})

// return plain object or empty object
var toObject = function(option){
   return option.getOrElse({})
}

// use lens to get job from list, returns option
var getJobByNow = function(lens, listObject, value){
   return filterByLensNow(lens, value, listObject)
}

var getJobBy = _.curry(getJobByNow)

// use id key to get exclusively add updated job
var xAddJobNow = function(listWrapped, option){
   return xAddToList(L.id, option, getNow(L.list, listWrapped))
}

var xAddJob = _.curry(xAddJobNow)

// replace the old list with updated list
var replaceList = function(fn, object, thisArg){
   var self = thisArg || this
   self.list = fn.call(get(L.list, self), object)
   return self
}

module.exports = environment()
   
