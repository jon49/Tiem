var
   Job = require('./../models/Job'),
   Jobs = require('./../models/Jobs'),

   toggleButton = _.curry(function(id, e){
      var self = this,
          tiem = self.tiem,
          jobs = tiem.jobs //jobs list
      Jobs.get(jobs, id).map(function(job){
         toggled = Job.with(job, new Date()) // toggled job
         self.update({tiem: {jobs: Jobs.with(jobs, toggled)}}) // get new list then update controller
      })
   })

module.exports = toggleButton
