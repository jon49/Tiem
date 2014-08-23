var 
   environment = require('./../../node_modules/fantasy-environment/fantasy-environment'),
   utils = require('./../utilities/utilities'),
   keys = require('./../constants/object-keys'),
   _ = require('./../../node_modules/lodash/lodash'),
   Option = require('./../../node_modules/fantasy-options/option'),

   ClockState =
      environment() 
      .method(
         'create', // {in: Date, out: Date Option}
         utils.identifiers([_.isDate, utils.isOptionOf(_.isDate)]),
         utils.tagged('ClockState', keys.clockStateKeys, [function(){return new Date()}, Option.None])
      )

module.exports = ClockState
