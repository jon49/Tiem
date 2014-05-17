/**
 * Contains functions for manipulating core time card objects.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k */


var isCreateJobSetting = function(id, name, active){
   return isWholeNumber(id) && _.isString(name) && _.isBoolean(active)
}

var isCreateJob = function(jobSettings, id, comment, singleDay, inOut, date){
   return isWholeNumber(id)
      && _.isString(comment)
      && (b.isOption(singleDay) && singleDay.fold(function(a){return _.isArray(a) && a.length === 24}, function(){return true}))
      && (_.isEqual(inOut, k.in()) || _.isEqual(inOut, k.out()))
      && _.isDate(date)
      && b.isInstanceOf(JobSettings, jobSettings)
}

t = t
   .method(
      'create',
      isCreateJob,
      Job
   )
   .method(
      'create',
      isCreateJobSetting,
      JobSetting
   )

var L = {}

var L.current = b.objectLens('current')
var L.list = b.objectLens('list')

var setCurrent = _.curry(function(items, item){
   return L.current.run(items).setter(item)
})

var addCurrent = function(items){
   items.current.map(function(a){
      var isId = isEqual(a.id)
      var items_ =  L.list.run(items).setter( 
         _.reject(items.list, function(c){
            return isId(c.id)
         }).concat(a))
      return items_
   }
   return items
}

var addNew = _.compose(addCurrent, setCurrent)

var addItems = _.partialRight(_.map, function(a){
   return addNew.apply(null, a)
})

// Eventually I'll need to get the data from a source, if that day has jobs already added.
var jobSettings =  (function(){
      var j = new JobSettings()
      var n = addNew(j)
      addItems([[0, 'My new job', true],[1, 'Next Job', true]])
      return j
   })()
//    Eventually I'll need to get the data from a source, if that day has jobs already added.
var jobs = new Jobs()

