var 
   _ = require('./../../node_modules/lodash/lodash'),
   Option = require('./../../node_modules/fantasy-options/option'),
   JobSettings = require('./../models/JobSettings'),
   JobSetting = require('./../models/JobSetting'),
   settingLens = JobSetting.L,

   //create a new job setting
   createNewJob = function(name){
      return confirm('Create a new job with name: "' + name + '"?')
             ? JobSetting.create(Option.None, name, true)
             : Option.None
   },

   // adds a new job to job & job settings list
   addJob = function(ctrl, value){
      //*****validate job here**********
      var tiem = ctrl.tiem
      var jobSettings = tiem.jobSettings,
          jobSetting = JobSettings.valid(jobSettings, value).cata({
             success: function(v){
                return   _.has(v, 'id')
                         ? JobSettings.get(jobSettings, settingLens.id.run(v).get())
                         : createNewJob(settingLens.name.run(v).get())
             },
             failure: function(errors){
                // show errors
                // future work
                return Option.None
             }
          })
      jobSetting.map(function(j){
         // jobSettings, id, comment, hours, inOut, date
         var settings = JobSettings.with(jobSettings, j),
             jobs = Jobs.with(tiem.jobs, Job.create(j.id, '', Option.None))
         // update controller
         ctrl.update({tiem: _.zipObject(['jobs', 'jobSettings'], [jobs, settings])})    
      })
   }

module.exports = addJob
