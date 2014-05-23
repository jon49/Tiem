/**
 * Contains functions for view.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k, m */

var fadeIn = function(e, isInit){
   if (!isInit) $(e).delay(500).fadeIn(1000)
}

var fadeOut = function(e, isInit){
   if (!isInit) $(e).delay(500).fadeOut(1000)
}

var $tm = undefined

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

var addJob = function(ctrl, value){
   //*****validate job here**********
   var job 
   var jobList = ctrl.jobSettings

   jobList.validSelection(value).cata({
      success: function(value){
         job = value
      },
      failure: function(errors){
         jobList.validName(value).cata({
            success: function(name){
               if (name && confirm('Create a new job with name: "' + name + '"?')){
                  job = jobList.create(jobList.newId(), name, true)
                  jobList.add(job)
               } else return undefined
            },
            failure: function(errors){
               //show errors to user
               return undefined
            }
         })
      }
   })
   // jobSettings, id, comment, singleDay, inOut, date
   ctrl.jobs.addNew(jobList, job.id, '', b.none, k.in(), new Date())
}

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
            onChange: function(value){
               m.startComputation()
               if (!_.isEmpty(value)){
                  addJob(ctrl, value)
                  selectize.removeOption(value)
                  selectize.clear()
               }
               m.endComputation()
            }
         } 
         var $select = $el.selectize(options_)
         var selectize = $select[0].selectize
      }
   }
}




