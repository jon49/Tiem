/**
 * Contains functions for view.
 */

// ------ Job Input --------

//create a new job setting
var createNewJob = function(name){
   return confirm('Create a new job with name: "' + name + '"?')
          ? JobSetting.create(b.none, name, true)
          : b.none
}

// adds a new job to job & job settings list
var addJob = function(ctrl, value){
   //*****validate job here**********
   var tiem = L.tiem.run(ctrl).getter()
   var jobSettings = getNow(L.jobSettings, tiem),
       jobSetting = JobSettings.valid(jobSettings, value).cata({
          success: function(v){
             return   _.has(v, k.id())
                      ? JobSettings.get(jobSettings, get(L.id, v))
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
      var settings = JobSettings.update(jobSettings, j),
          jobs = getNow(L.jobs, tiem),
          jobs_ = Jobs.update(jobs, Job.create(j.id, '', b.none))
      // update controller
      ctrl.update({tiem: _.zipObject(['jobs', 'jobSettings'], [jobs, settings])})    
   })
}

var toggleButton = _.curry(function(id, e){
   var tiem = getNow(L.tiem, this),
       jobs = get(L.jobs, tiem), //jobs list
       toggled = Job.update(new Date(), Jobs.get(jobs, id)) // toggled job
   this.update(b.singleton(tiem, b.singleton('jobs', Jobs.update(toggled, jobs)))) // get new list then update controller
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
