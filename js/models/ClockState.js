var 
   environment = require('./../../node_modules/fantasy-environment/fantasy-environment.js').environment,
   u = require('utils'),
   k = require('./../constants/keys'),
   _ = require('lodash'),

   ClockState = environment() 
      .method(
         'create', // {in: Date, out: Date Option}
         u.identifiers([u.isOptionOf(_.isDate), u.isOptionOf(_.isDate)]),
         u.tagged('ClockState', clockStateKeys, [function(){return new Date()}, b.none])
      )

module.exports = ClockState
