Option = require './../../node_modules/fantasy-options/option'
L = require './../constants/lenses'
JobSetting = require './../models/JobSetting'

describe 'How Job Setting model is used:', !->

   jobSetting = JobSetting.create 0 , 'Job Name', true
   someJobSetting = Option.Some jobSetting

   describe 'The function `create`', !-> ``it``
      .. 'should create a new Job Setting plain object', !->
         (expect jobSetting).toEqual {
            id: 0
            name: 'Job Name'
            jobActive: true
            ctor: 'JobSetting'
         }

   describe 'The function `isSelf`', !-> ``it``
      .. 'should determine if the object is JobSetting', !->
         (expect (JobSetting.isSelf someJobSetting)).toBe true
         (expect JobSetting.isSelf({not: 'Self'})).toBe false

   describe 'The function `with`', !-> ``it``
      .. 'should create a new object with updated name', !->
         (expect JobSetting.with(someJobSetting, {name: 'New Job Name'})).toEqual (
            Option.Some {id: 0, name: 'New Job Name', jobActive: true, ctor: 'JobSetting'}
         )
      .. 'should create a new object with updated jobActive', !->
         (expect JobSetting.with(someJobSetting, {jobActive: false})).toEqual (
            Option.Some {id: 0, name: 'Job Name', jobActive: false, ctor: 'JobSetting'}
         )
