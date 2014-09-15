Option = require './../../node_modules/fantasy-options/option'
JobSetting = require './../models/JobSetting'
JobSettings = require './../models/JobSettings'
Validation = require './../../node_modules/fantasy-validations/validation'

describe 'How Job Settings model is used:', !->

   jobSetting = JobSetting.create 0 , 'Job Name', true
   someJobSetting = Option.Some JobSetting.create 0 , 'Job Name', true
   jobSettings = JobSettings.create [jobSetting]

   describe 'The function `create`', !-> ``it``
      .. 'should create an array of Job Setting objects', !->
         (expect JobSettings.create [jobSetting]).toEqual (
            list: [
               id: 0
               name: 'Job Name'
               jobActive: true
               ctor: 'JobSetting'
            ] 
            ctor: 'JobSettings')

   describe 'The function `isSelf`', !-> ``it``
      .. 'should determine if the object is JobSettings', !->
         (expect JobSettings.isSelf jobSettings).toBe true
         (expect JobSettings.isSelf {not: 'Self'}).toBe false

   describe 'The function `valid`', !-> ``it``
      .. 'should return `Success` when valid id', !->
         (expect JobSettings.valid jobSettings, 0).toEqual Validation.Success 0
      .. 'should return `Failure` when invalid id', !->
         (expect JobSettings.valid jobSettings, 1).toEqual (
            Validation.Failure ['No such ID number exists']
         )

   describe 'The function `valid`', !-> ``it``
      .. 'should return `Success` when valid new name is given', !->
         (expect JobSettings.valid jobSettings, 'New Job Name').toEqual (
            Validation.Success 'New Job Name'
         )
      .. 'should return `Failure` when invalid new name is given', !->
         (expect JobSettings.valid jobSettings, '').toEqual (
            Validation.Failure ['Job name must contain characters']
         )
      .. 'should return `Failure` when name already exists', !->
         (expect JobSettings.valid jobSettings, 'Job Name').toEqual (
            Validation.Failure ['Job name already exists']
         )

   describe 'The function `with`', !-> ``it``
      .. 'should return a new array with the exclusively added JobSetting object', !->
         newJobSetting = JobSetting.create JobSetting.createId!, 'Job1', true
         (expect JobSettings.with jobSettings, newJobSetting).toEqual (
            list: [
               jobSetting
               newJobSetting
            ]
            ctor: 'JobSettings'
         )

   describe 'The function `get`', !-> ``it``
      .. 'should return a JobSetting Option object when given the id', !->
         (expect JobSettings.get jobSettings, 0).toEqual someJobSetting
      .. 'should return a JobSetting Option object when given the job name', !->
         (expect JobSettings.get jobSettings, 'Job Name').toEqual someJobSetting
