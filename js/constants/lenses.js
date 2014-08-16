var
   t = require('./../utilities/utilities'),
   k = require('./constants'),
   oKeys = require('./object-keys'),
   _ = require('./../../node_modules/lodash/lodash')
   lens = require('./../../node_modules/fantasy-lenses/lens').Lens.objectLens

// create an object of lens objects
var makeLenses = t.zipObjectT(_.identity, lens)

var Lenses =
   makeLenses(
      _.union(
         jobSettingKeys, 
         clockInKeys,
         clockOutKeys,
         jobKeys,
         listObjects,
         [
            k.jobs,
            'jobSettings',
            k.tiem,
            k.date
         ]
      )
   )

module.exports = Lenses
