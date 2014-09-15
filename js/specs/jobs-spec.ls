Option = require './../../node_modules/fantasy-options/option'
ClockState = require './../models/ClockState'
Job = require './../models/Job'
Jobs = require './../models/Jobs'

describe 'How Jobs model is used:', !->

   clockState = ClockState.create new Date!, (Option.None)
   job = Job.create 0, 'Comment', [clockState]
   someJob = Option.Some job
   jobs = Jobs.create [job]

   describe 'The function `create`', !-> ``it``
      .. 'should create an array of Job objects', !->
         (expect Jobs.create [job]).toEqual (
            list: [
               id: 0
               comment: 'Comment'
               clockState: [clockState]
               ctor: 'Job'
            ] 
            ctor: 'Jobs')

   describe 'The function `isSelf`', !-> ``it``
      .. 'should determine if the object is Jobs', !->
         (expect Jobs.isSelf jobs).toBe true
         (expect Jobs.isSelf {not: 'Self'}).toBe false

   describe 'The function `with`', !-> ``it``
      .. 'should return a new array with the exclusively added Job object', !->
         newJob = Job.create 1, 'Another Comment', [clockState]
         (expect Jobs.with jobs, newJob).toEqual (
            list: [
               job
               newJob
            ]
            ctor: 'Jobs'
         )

   describe 'The function `get`', !-> ``it``
      .. 'should return a Job Option object when given the id', !->
         (expect Jobs.get jobs, 0).toEqual someJob
