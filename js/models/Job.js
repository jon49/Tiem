var 
   environment = require('./../../node_modules/fantasy-environment/fantasy-environment'),
   t = require('./../utilities/utilities'),
   o = require('./../utilities/utilities-objects'),
   keys = require('./../constants/object-keys'),
   _ = require('./../../node_modules/lodash/lodash'),
   Option = require('./../../node_modules/fantasy-options/option'),
   L = require('./../constants/lenses'),
   k = require('./../constants/constants').k,
   ClockState = require('./ClockState'),

   //Determine if the job is clocked in or out.
   isClockedIn = function(clockState){
      return t.isNone(o.getNow(L.out, clockState))
   },
   
   // Toggle the clock in object.
   updateDate = function(option, date){
      var result
      return (
         result = option.map(function(j){
            var clockStore = L.clockState.run(j),
                clockArray = clockStore.get(),
                previousClockArray = clockArray.slice(0, -1),
                previousClockState = _.last(clockArray),
                date_ = date.date
            return isClockedIn(previousClockState)
                   ? clockStore.set(previousClockArray.concat(L.out.run(previousClockState).set(Option.Some(date_)))) // Clock out
                   : clockStore.set(previousClockArray.concat(previousClockState, ClockState.create(date_, Option.None))) // clock in
            })
      )
   }, 

   jobString = 'Job',

   isSelf = t.isOptionOf(t.isObjectNamed(jobString))

module.exports = environment()
   .method(
      'create', // {id: Whole Number, comment: String, clockState: Array ClockState}
      t.identifiers([t.isWholeNumber, _.isString, t.isArrayOf(t.isObjectNamed('ClockState'))]),
      t.tagged(jobString, keys.jobKeys, [-1, "", function(){return [ClockState(Option.None, Option.None)]}])
   )
   .property(
      'isSelf',
      isSelf
   )
   .method(
      'with',
      t.identifiers([isSelf, t.isSingletonOf(k.comment, _.isString)]),
      o.setOption(L.comment)
   )
   .method(
      'with',
      t.identifiers([isSelf, t.isSingletonOf('date', _.isDate)]),
      updateDate
   )
   .method(
      'isClockedIn',
      t.identifiers([isSelf]),
      function(job){
         return job.fold(
            function(j){
               return isClockedIn(_.last(L.clockState.run(j).get()))
            },
            _.constant(false)
         )
      }
   )
