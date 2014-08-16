ClockState = require './../models/ClockState'
keys = require './../constants/object-keys'

describe 'How ClockState model is used:', !->

   describe 'The function `create`', !-> ``it``
      .. 'should create a new ClockState plain object', !->
         newDate = new Date!
         (expect keys.clockStateKeys.length).toEqual 2
         (expect (ClockState.create newDate, (Option.Some newDate))).toEqual {'in': newDate, 'out': Option.Some newDate, ctor: 'ClockState'}
