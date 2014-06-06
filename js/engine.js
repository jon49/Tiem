/**
 * Contains functions for view.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k, m, b */

var TargetList = b.tagged('TargetList', ['target', 'list'])

// create an object of lens objects
var lenses = _.compose(zipObjectT(_.identity, b.objectLens), _.unique)

var targetLens = b.objectLens('target')
var listLens = b.objectLens('list')

// Set the target key with a single object from the list key
var setTargetBy = function(keyLens, value, thisArg){
      var o = thisArg || this
      var target = _.first(_.filter(o.list, function(o_){
         return _.isEqual(keyLens.run(o_).getter, value)
      }))
      return targetLens.run(o).setter(_.isEmpty(target) ? b.none : b.some(target))
}

var toTarget = function(target, thisArg){
   var o = thisArg || this
   return targetLens.run(o).setter(_.isEmpty(target) ? b.none : b.some(target))
}

// Take the object from target and remove it from the list 
// and then add it to the end of the list
var xAddToList = function(keyLens, thisArg){
      var o = thisArg || this
      return o.target.map( //if target is something
         function(t){
            var targetKeyValue = keyLens.run(t).getter
            return listLens.run(o).setter( // then set the list
               _.reject(o.list, function(i){ // without the current target
                  return _.isEqual(keyLens.run(i).getter, targetKeyValue)
               }).concat(t)) // then add the target to the end
         })
      .getOrElse(o) // otherwise return the original object
}

var get = function(lens, thisArg){
   return lens.run(thisArg).getter
}

var set = _.curry(function(lens, thisArg, value){
   return lens.run(thisArg).setter(value)
})

// http://thisisafiller.ghoster.io/notes-on-functional-programming-patterns-for-the-non-mathematician-with-brian-lonsdorf/
var overTarget = function(lens, func, thisArg){
   var o = thisArg || thisArg
   return o.target.map(
      function(t){
         var over_ = _.compose(set(targetLens, o), set(lens, t), _.partial(func.call, t))
         return over_(get(lens, t))
      })
   .getOrElse(o)
}

