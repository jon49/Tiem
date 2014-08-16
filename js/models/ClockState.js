var 
   environment = require('./../../node_modules/fantasy-environment/fantasy-environment'),
   t = require('./../utilities/utilities'),
   k = require('./../constants/object-keys'),
   _ = require('./../../node_modules/lodash/lodash'),
   Option = require('./../../node_modules/fantasy-options/option'),

   ClockState =
      environment() 
      .method(
         'create', // {in: Date, out: Date Option}
         t.identifiers([_.isDate, t.isOptionOf(_.isDate)]),
         t.tagged('ClockState', k.clockStateKeys, [function(){return new Date()}, Option.None])
      )

module.exports = ClockState
