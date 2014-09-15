var 
   environment = require('./../../node_modules/fantasy-environment/fantasy-environment'),
   t = require('./../utilities/utilities'),
   o = require('./../utilities/utilities-objects'),
   _ = require('./../../node_modules/lodash/lodash'),
   Option = require('./../../node_modules/fantasy-options/option'),
   ClockState = require('./ClockState'),

   keys = ['id', 'comment', 'clockState'],

   k = t.zipObjectArray(keys),

   lenses = t.makeLenses(keys),

   L = _.assign({}, ClockState.L, lenses),

   //Determine if the job is clocked in or out.
   isClockedIn = function(clockState){
      return t.isNone(o.getNow(L.out, clockState))
   },
   
   // Toggle the clock in object.
   updateDate = function(object, date){
      var clockStore = L.clockState.run(object),
          clockArray = clockStore.get(),
          previousClockArray = clockArray.slice(0, -1),
          previousClockState = _.last(clockArray),
          date_ = date.date
      return isClockedIn(previousClockState)
             ? clockStore.set(previousClockArray.concat(L.out.run(previousClockState).set(Option.Some(date_)))) // Clock out
             : clockStore.set(previousClockArray.concat(previousClockState, ClockState.create(date_, Option.None))) // clock in
   }, 

   jobString = 'Job',

   isSelf = t.isObjectNamed(jobString)

module.exports = environment()
   .method(
      'create', // {id: Whole Number, comment: String, clockState: Array ClockState}
      t.identifiers([
         t.isWholeNumber,
         _.isString,
         t.isArrayOf(ClockState.isSelf)
      ]),
      t.tagged(
         jobString,
         keys,
         [-1, "", function(){return [ClockState.create(new Date(), Option.None)]}]
      )
   )
   .property('isSelf', isSelf)
   .property('L', lenses)
   .method(
      'with',
      t.identifiers([isSelf, t.isSingletonOf(k.comment, _.isString)]),
      o.set(L.comment)
   )
   .method(
      'with',
      t.identifiers([isSelf, t.isSingletonOf('date', _.isDate)]),
      updateDate
   )
   .method(
      'isClockedIn',
      t.identifiers([isSelf]),
      function(j){
         return isClockedIn(_.last(L.clockState.run(j).get()))
      }
   )
