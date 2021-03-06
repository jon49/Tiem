/**
 * Contains functions for view.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k, m */

// ------ Job Input --------

//create a new job setting
var createNewJob = function(name){
   return confirm('Create a new job with name: "' + name + '"?')
          ? t.JobSetting.create(t.JobSetting.newId(), name, true)
          : b.none
}

// adds a new job to job & job settings list
var addJob = function(ctrl, value){
   //*****validate job here**********
   var jobSettings = get(L.jobSettings, ctrl),
       jobSetting = jobSettings.valid(value).cata({
          success: function(v){
             return   _.has(v, k.id())
                      ? jobSettings.get(get(L.id, v))
                      : createNewJob(get(L.name, v))
          },
          failure: function(errors){
             // show errors
             // future work
             return b.none
          }
       })
   jobSetting.map(function(j){
      // jobSettings, id, comment, hours, inOut, date
      var settings = jobSettings.update(t.JobSetting.create(j)),
          jobs = get(L.jobs, ctrl).update(t.Job.create(settings, j.id, '', b.none, k.in(), new Date()))
      // update controller
      ctrl.update(_.zipObject(['jobs', 'jobSettings'], [jobs, settings]))    
   })
}

var toggleButton = _.curry(function(id, e){
   var ctrl = this,
       jobs = get(L.jobs, ctrl), //jobs list
       toggled = t.Job.update(new Date(), jobs.get(id)) // toggled job
   ctrl.update(b.singleton('jobs', jobs.update(toggled))) // get new list then update controller
})

var selectize_ = {}

selectize_.config = function(ctrl){
   return function(element, isInit){
      var $el = $(element)
      if (!isInit){
         var currentJobIds = _.pluck(ctrl.jobs.toArray(), k.id())
         var options$ = _.reject(ctrl.jobSettings.toArray(), function(j){
               return _.contains(currentJobIds, get(L.id, j))
            })
         var options_ = {
            persist: false,
            selectOnTab: false, // Tab loses focus along with selecting. Will have to wait until this is fixed, or take care of it myself.
            maxItems: 1,
            create: true,
            hideSelected: true,
            options: options$,
            labelField: k.name(),
            valueField: k.id(),
            searchField: k.name(),
            sortField: k.name(),
            borderColor: ctrl.settings.inColor,
            onChange: function(value){
               m.startComputation()
               if (!_.isEmpty(value)){
                  addJob(ctrl, isLikeNumber(value) ? parseInt(value) : value)
                  selectize.removeOption(value)
                  selectize.refreshItems()
                  selectize.showInput()
               }
               m.endComputation()
            }
         } 
         var $select = $el.selectize(options_)
         var selectize = $select[0].selectize
      }
   }
}




