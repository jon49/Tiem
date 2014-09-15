ClockState = require './../models/ClockState'
Option = require './../../node_modules/fantasy-options/option'

describe 'How ClockState model is used:', !->

   describe 'The function `create`', !-> ``it``
      .. 'should create a new ClockState plain object', !->
         newDate = new Date!
         (expect (ClockState.create newDate, (Option.Some newDate))).toEqual {
            'in': newDate
            'out': (Option.Some newDate)
            ctor: 'ClockState'
         }
