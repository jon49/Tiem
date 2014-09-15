var
   _ = require('./../../node_modules/lodash/lodash'),
   environment = require('./../../node_modules/fantasy-environment/fantasy-environment').environment,
   JobSettings = require('./../models/JobSettings'),
   jobSettingLens = require('./../models/JobSetting').L,
   jobLens = require('./../models/Job').L

   getJobName = _.curry(function(jobSettings, job){
      var id = jobLens.id.run(job).get(),
          name = JobSettings.get(jobSettings, id).fold(
             function(jobSetting){
               return jobSettingLens.name.run(jobSetting).get()
             },
             t.error('No such job exists!')
          )
      return name
   })

module.exports = 
   environment()
   .property(
      'getJobName',
      getJobName
   )
