Option = require './../../node_modules/fantasy-options/option'
JobSetting = require './../models/JobSetting'

describe 'How Job Setting model is used:', !->

   jobSetting = JobSetting.create 0 , 'Job Name', true

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
         (expect (JobSetting.isSelf jobSetting)).toBe true
         (expect JobSetting.isSelf({not: 'Self'})).toBe false

   describe 'The function `with`', !-> ``it``
      .. 'should create a new object with updated name', !->
         (expect JobSetting.with(jobSetting, {name: 'New Job Name'})).toEqual (
            {id: 0, name: 'New Job Name', jobActive: true, ctor: 'JobSetting'}
         )
      .. 'should create a new object with updated jobActive', !->
         (expect JobSetting.with(jobSetting, {jobActive: false})).toEqual (
            {id: 0, name: 'Job Name', jobActive: false, ctor: 'JobSetting'}
         )
