/**
 * Contains functions for view.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k, m */

var fadeIn = function(e, isInit){
   if (!isInit) $(e).delay(250).fadeIn(1000)
}

var fadeOut = function(e, isInit){
   if (!isInit) $(e).delay(250).fadeOut(1000)
}

var $tm = void 0

var define$tm = function(e, isInit){if (!isInit) $tm = $(e)}

var moveE = function(e, isInit){
   if(!isInit){
      var $te = $(e)
      // position and widths of `Time` divs
      var pTi = 0, wTi = 29, pm = 29, pe = 57, wm = 28, we = 18
      $tm.delay(2000).animate({
         left: (pe - pm - (wm - we))
      }, 1000)
      $te.delay(2000).animate({
         left: (pm - pe)
      }, 1000)
   }
}

// ------ Job Input --------

var createNewJob = function(name){
   return confirm('Create a new job with name: "' + name + '"?')
          ? t.JobSetting.create(t.JobSetting.newId(), name, true)
          : b.none
}

// adds a new job to job & job settings list
var addJob = function(ctrl, value){
   //*****validate job here**********
   var jobSettings = ctrl.jobSettings

   var jobSetting = jobSettings.valid(value).cata({
      success: function(v){
         return   b.isInstanceOf(JobSettingsOption, v)
                  ? v
                  : createNewJob(v)
      },
      failure: function(errors){
         // show errors
         // future work
         return b.none
      }
   })
   jobSetting.map(function(j){
      // jobSettings, id, comment, singleDay, inOut, date
      ctrl.jobs.update(t.Job.create(jobSettings, j.id, '', b.none, k.in(), new Date()))
      jobSettings.update(j)
   })
}

var toggleButton = _.curry(function(id, e){
   m.startComputation()
   this.update(this.get(id).update(new Date()))
   m.endComputation()
})

var selectize = {}

selectize.config = function(ctrl){
   return function(element, isInit){
      var $el = $(element)
      if (!isInit){
         var options$ = _.reject(ctrl.jobSettings.toArray(), function(job){
               return _.contains(ctrl.jobs.toArray(), job.name)
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
                  addJob(ctrl, value)
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




