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

   isSelf = t.isOptionOf(t.isObjectNamed('JobSetting'))

module.exports = 
   environment() 
   .method(
      'create', // {jobID: 0, name: 'name', jobActive: true|false}
      t.identifiers([t.isWholeNumber, _.isString, _.isBoolean]),
      t.tagged('JobSetting', keys.jobSettingKeys, [-1, "Name Empty", true])
   )
   .property('isSelf', isSelf)
   .property('createId', function(){return (new Date()).getTime()})
   .method(
      'with',
      t.identifiers([isSelf, t.isSingletonOf(k.name, _.isString)]),
      o.setOption(L.name)
   )
   .method(
      'with',
      t.identifiers([isSelf, t.isSingletonOf(k.jobActive, _.isBoolean)]),
      o.setOption(L.jobActive)
   )
