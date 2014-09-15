var 
   environment = require('./../../node_modules/fantasy-environment/fantasy-environment'),
   _ = require('./../../node_modules/lodash/lodash'),
   Option = require('./../../node_modules/fantasy-options/option'),
   t = require('./../utilities/utilities'),

   keys = ['in', 'out']

module.exports =
      environment() 
      .method(
         'create', // {in: Date, out: Date Option}
         t.identifiers([_.isDate, t.isOptionOf(_.isDate)]),
         t.tagged('ClockState', keys, [0, Option.None])
      )
      .property('L', t.makeLenses(keys))
