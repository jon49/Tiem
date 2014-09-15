Option = require './../../node_modules/fantasy-options/option'
ClockState = require './../models/ClockState'
Job = require './../models/Job'
t = require './../utilities/utilities'
o = require './../utilities/utilities-objects'

describe 'How Job model is used:', !->

   clockState = ClockState.create new Date!, (Option.None)
   outStore = ClockState.L.out.run clockState
   inStore = ClockState.L.in.run clockState

   describe 'The function `create`', !-> ``it``
      .. 'should create a new Job plain object', !->
         (expect (Job.create 0 , 'This is a comment', [clockState])).toEqual {
            id: 0
            comment: 'This is a comment'
            clockState: [clockState]
            ctor: 'Job'
         }

   describe 'The function `isSelf`', !-> ``it``
      .. 'should determine if it is calling itself', !->
         job = Job.create 0, '', [clockState]
         (expect (Job.isSelf job)).toBe true
      .. 'should determine if it isn\'t calling itself', !->
         (expect (Job.isSelf clockState)).toBe false

   describe 'The function `isClockedIn`', !-> ``it``
      .. 'should determine if Job is clocked in', !->
         jobIn = Job.create 0, '', [clockState]
         (expect (Job.isClockedIn jobIn)).toBe true
      .. 'should determine if Job is clocked out', !->
         jobOut = Job.create 0, '', [outStore.set (Option.Some (new Date!))]
         (expect Job.isClockedIn jobOut).toBe false

   describe 'The function `with`', !-> ``it``
      job = Job.create 0, '', [clockState]
      .. 'should update the comment and return a new object', !->
         (expect Job.with job, {comment: 'New Comment.'}).toEqual (
            Job.create 0, 'New Comment.', [clockState]
         )
         (expect job).toEqual Job.create 0, '', [clockState]
      .. 'should update the clock state and return a new object', !->
         newDate = new Date!
         newClockState = outStore.set (Option.Some newDate)
         newClockIn = inStore.set newDate
         newClockedOutJob = Job.with job, {date: newDate}
         newClockedInJob = Job.with newClockedOutJob, {date: newDate}
         (expect newClockedOutJob).toEqual Job.create 0, '', [newClockState]
         (expect newClockedInJob).toEqual Job.create 0, '', [newClockState, newClockIn]
