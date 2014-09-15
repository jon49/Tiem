var 
   _ = require('./../../node_modules/lodash/lodash'),
   t = require('./../utilities/utilities'),
   Job = require('./../models/Job'),
   jobLens = Job.L,
   view = require('./common'),
   tiemStamp = require('./tiemstamp'), 

   hiddenTiemStamp = tiemStamp(true),

   visibleTiemStamp = tiemStamp(false),

   stamps = _.curry(function(stampClass, tiem){
      var jobSettings = tiem.jobSettings,
          jobs = tiem.jobs,
          jobList = jobs.list,
          isRecentlyAdded = isEqual(_.last(jobList)),
          clockType = _.isEqual(stampClass, '.stamps-in') ? Job.isClockedIn : _.compose(t.not, Job.isClockedIn),
          name = view.getJobName(jobSettings)

      return (
         m(stampClass, 
           _(jobList)
           .filter(clockType)
           .sortBy(_.compose(t.invoke('toLowerCase'), name))
           .map(function(j){
              return (isRecentlyAdded(jobLens.id.run(j).get()) ? hiddenTiemStamp : visibleTiemStamp)(j, tiem)
           })
           .value()
         )
      )
   })

module.exports = stamps
