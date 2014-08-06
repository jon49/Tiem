//Determine if the job is clocked in or out.
var isClockedIn = function(clockState){
   return !b.isSome(getNow(L.out, clockState))
}

// Toggle the clock in object.
var updateDate = function(date, option){
   var result
   return (
      result = option.map(function(j){
         var clockArray = getNow(L.clockState, j),
             newClockArray = clockArray.slice(0, -1)
         return isClockedIn(_.last(clockArray))
                ? setNow(L.clockState, j, newClockArray.concat(setNow(L.out, state, b.some(date)))) // Clock out
                : setNow(L.clockState, j, newClockArray.concat(ClockState.create(date, b.none))) // clock in
         })
   )
} 

Job =
   Job
   .property(
      'isSelf',
      t.isOptionOf(t.isObjectNamed('Job'))
   )
   .method(
      'update',
      identifiers([_.isString, Job.isSelf]),
      setOption(L.comment)
   )
   .method(
      'update',
      identifiers([_.isDate, Job.isSelf]),
      updateDate
   )
  .method(
      'name',
      identifiers([t.isObjectNamed('JobSettigs'), Job.isSelf]),

      // Get job name from the job settings object by id.
      _.curry(function(jobSettings, job){
         return jobSettings.get(getNow(L.id, job)).fold(get(L.name), 'Unknown Name')
      })
  )
  .method(
      'toObject',
      Job.isSelf,
      toObject
  )
