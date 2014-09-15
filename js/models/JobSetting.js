var 
   environment = require('./../../node_modules/fantasy-environment/fantasy-environment'),
   t = require('./../utilities/utilities'),
   o = require('./../utilities/utilities-objects'),
   _ = require('./../../node_modules/lodash/lodash'),
   Option = require('./../../node_modules/fantasy-options/option'),
   ClockState = require('./ClockState'),

   keys = ['id', 'name', 'jobActive'],

   k = t.zipObjectArray(keys),

   L = t.makeLenses(keys),

   isSelf = t.isObjectNamed('JobSetting')

module.exports = 
   environment() 
   .method(
      'create', // {jobID: 0, name: 'name', jobActive: true|false}
      t.identifiers([t.isWholeNumber, _.isString, _.isBoolean]),
      t.tagged('JobSetting', keys, [-1, "Name Empty", true])
   )
   .property('isSelf', isSelf)
   .property('L', L)
   .property('createId', function(){return (new Date()).getTime()})
   .method(
      'with',
      t.identifiers([isSelf, t.isSingletonOf('name', _.isString)]),
      o.set(L.name)
   )
   .method(
      'with',
      t.identifiers([isSelf, t.isSingletonOf('jobActive', _.isBoolean)]),
      o.set(L.jobActive)
   )
