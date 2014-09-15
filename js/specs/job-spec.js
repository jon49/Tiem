// Generated by LiveScript 1.2.0
var Option, ClockState, Job, t, o;
Option = require('./../../node_modules/fantasy-options/option');
ClockState = require('./../models/ClockState');
Job = require('./../models/Job');
t = require('./../utilities/utilities');
o = require('./../utilities/utilities-objects');
describe('How Job model is used:', function(){
  var clockState, outStore, inStore;
  clockState = ClockState.create(new Date(), Option.None);
  outStore = ClockState.L.out.run(clockState);
  inStore = ClockState.L['in'].run(clockState);
  describe('The function `create`', function(){
    var x$;
    x$ = it;
    x$('should create a new Job plain object', function(){
      expect(Job.create(0, 'This is a comment', [clockState])).toEqual({
        id: 0,
        comment: 'This is a comment',
        clockState: [clockState],
        ctor: 'Job'
      });
    });
  });
  describe('The function `isSelf`', function(){
    var x$;
    x$ = it;
    x$('should determine if it is calling itself', function(){
      var job;
      job = Job.create(0, '', [clockState]);
      expect(Job.isSelf(job)).toBe(true);
    });
    x$('should determine if it isn\'t calling itself', function(){
      expect(Job.isSelf(clockState)).toBe(false);
    });
  });
  describe('The function `isClockedIn`', function(){
    var x$;
    x$ = it;
    x$('should determine if Job is clocked in', function(){
      var jobIn;
      jobIn = Job.create(0, '', [clockState]);
      expect(Job.isClockedIn(jobIn)).toBe(true);
    });
    x$('should determine if Job is clocked out', function(){
      var jobOut;
      jobOut = Job.create(0, '', [outStore.set(Option.Some(new Date()))]);
      expect(Job.isClockedIn(jobOut)).toBe(false);
    });
  });
  describe('The function `with`', function(){
    var x$, job;
    x$ = it;
    job = Job.create(0, '', [clockState]);
    x$('should update the comment and return a new object', function(){
      expect(Job['with'](job, {
        comment: 'New Comment.'
      })).toEqual(Job.create(0, 'New Comment.', [clockState]));
      expect(job).toEqual(Job.create(0, '', [clockState]));
    });
    x$('should update the clock state and return a new object', function(){
      var newDate, newClockState, newClockIn, newClockedOutJob, newClockedInJob;
      newDate = new Date();
      newClockState = outStore.set(Option.Some(newDate));
      newClockIn = inStore.set(newDate);
      newClockedOutJob = Job['with'](job, {
        date: newDate
      });
      newClockedInJob = Job['with'](newClockedOutJob, {
        date: newDate
      });
      expect(newClockedOutJob).toEqual(Job.create(0, '', [newClockState]));
      expect(newClockedInJob).toEqual(Job.create(0, '', [newClockState, newClockIn]));
    });
  });
});