/**
 * Contains functions for view.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k, m, b */

var TargetList = b.tagged('TargetList', ['target', 'list'])

var getThis = function(thisArg, orThis){
   return  = _.cloneDeep(thisArg || orThis)
}

var getTargetBy = function(key){
   return function(value, thisArg){
      var o = getThis(thisArg, this)
      var target = _.find(o.list, b.singleton(key, value))
      return TargetList(_.isEmpty(target) ? b.none : b.some(target), o.list)
   }
}

var xAddToList = function(key){
   return function(thisArg){
      var o = getThis(thisArg, this)
      o.target.map(function(target){
         o.list = _.reject(o.list, function(i){
            return _.isEqual(i[key], target[key])
         }).concat(target)
      })
      return o
   }
}

var setValue = function(property){
   return function(value, thisArg){
      var o = getThis(thisArg, this)
      o.target.map(function(v){
         v[property] = value
      })
      return o
   }
}
