/* brackets-xunit: jasmine */
/* brackets-xunit: includes=../bower_components/lodash/dist/lodash.min.js,../bower_components/bilby.js/bilby-min.js,utilities.js,objects.js,templates.js,ui.js */

/* global describe, it, expect, t, _, bilby */
/*jslint asi: true*/
/*jshint indent:3, curly:false, laxbreak:true */

describe("How the utilities are used in project", function () {
   //stringSize
   it('should trim and cut words which are too long', function () {
      expect(t.stringSize(' yes! ', 3)).toEqual('yes')
   })
   it('should be able to trim without cutting', function () {
      expect(t.stringSize(' yes! ', 4)).toEqual('yes!')
   })
   it('should leave alone a string without leading/following white space which isn\'t to long', function () {
      expect(t.stringSize('yes !', 5)).toEqual('yes !')
   })
   //isWholeNumber
   it('should return true when a whole number is given', function () {
      expect(t.isWholeNumber(3)).toEqual(true)
   })
   it('should return false when given number which is not a whole number', function () {
      expect(t.isWholeNumber(3.14)).toEqual(false)
   })
   it('should return false when given an item which is not a number', function () {
      expect(t.isWholeNumber('3')).toEqual(false)
   })
   //isBetween
   it('should tell if a number is in between two numbers', function () {
      expect(t.isBetween(2, 4, 3)).toBe(true)
   })
   it('should tell if a number is in between or equal to two numbers', function () {
      expect(t.isBetween(2, 4, 2) && t.isBetween(2, 4, 4)).toBe(true)
   })
   it('should tell if a number is outside the bounds of two numbers', function () {
      expect(t.isBetween(2, 4, 1) && t.isBetween(2, 4, 5)).toBe(false)
   })
   //areUnique
   it('should determine if the values in an object array are unique', function () {
      var uniqueObject = [{
         dogName: 'Lassie',
         color: 'multi'
      }]
      var uniqueObjects = [{
         dogName: 'Lassie',
         color: 'multi'
      }, {
         dogName: 'Hassie',
         color: 'brown'
      }]
      var notUniqueObjects = [{
         dogName: 'Lassie',
         color: 'multi'
      }, {
         dogName: 'Lassie',
         color: 'brown'
      }]

      expect(t.areUnique(uniqueObject, 'dogName')).toBe(true)
      expect(t.areUnique(uniqueObjects, 'dogName')).toBe(true)
      expect(t.areUnique(notUniqueObjects, 'dogName')).not.toBe(true)
   })
   it('should convert arguments to array and flatten array', function () {
      var test = function () {
         return t.toFlatArray(arguments)
      }
      expect(test(1, [2])).toEqual([1, 2])
   })
   it('should negate a function.', function () {
      var isNotString = t.complement(_.isString)
      expect(isNotString(0)).toBe(true)
      expect(isNotString('s')).toBe(false)
   })
   describe("The function addRollingArray", function () {
      var array = [0.5, 0, 0, 0]
      it('should add rolling values to an array from beginning through the last index', function () {
         expect(t.addRollingArray(array, 1.5, 4, 1)).toEqual([0.5, 0.5, 1, 1])
      })
      it('should do partial adding at the beginning and end of the array when start and end are not integers', function () {
         expect(t.addRollingArray(array, 1.5, 3.5, 1)).toEqual([0.5, 0.5, 1, 0.5])
      })
      it('should add to previous values when within start and end values and be able to add full value to beginning of an array', function () {
         var array2 = _.clone(array);
         array2.push(5);
         array2[0] = 2
         expect(t.addRollingArray(array2, 0, 3.5, 1)).toEqual([3, 1, 1, 0.5, 5])
      })
      it('should add the difference of the starting and ending points when they are on the same index', function () {
         expect(t.addRollingArray(array, 0, 0.25, 1)).toEqual([0.75, 0, 0, 0])
      })
   })
   describe("fractionalHours", function () {
      it('should convert a date to a fractional hour value down to the seconds', function () {
         expect(t.fractionalHours(new Date(2014, 3, 6, 15, 15, 36))).toEqual(15.26)
      })
   })
   describe("sum", function () {
      it("should add the elements in an array", function () {
         expect(t.sum([1, 2, 3])).toEqual(6)
      })
      it("should reject elements which are not numbers", function () {
         expect(t.sum([1, 2, '3', 'a'])).toEqual(6)
      })
   })
   describe("The function areUniqueValues", function () {
      it("should return a function which evaluates an array of objects given a certain key - true when all unique", function () {
         expect(t.areUniqueValues('myKey')([{
            myKey: 1
         }, {
            myKey: 2
         }])).toBe(true)
      })
      it("should return a function which evaluates an array of objects given a certain key - false when not unique", function () {
         expect(t.areUniqueValues('myKey')([{
            myKey: 2
         }, {
            myKey: 2
         }])).toBe(false)
      })
   })
   describe("The function zipObjectT", function () {
      it("should map an array to a key and value functions and return an object", function () {
         expect(t.zipObjectT(_.identity, function () {
            return ', world!'
         }, ['Hello'])).toEqual({
            Hello: ', world!'
         })
      })
   })
   describe("The function constants", function () {
      it("should return a function of constant value", function () {
         var keys = t.constants([['yep', 'yay!'], ['nope']])
         expect(keys.yep()).toEqual('yay!')
      })
   })
   describe('The function hasAll', function(){
      var o = {id:0,key1:'some value'}
      it('should be true when all specified keys are true', function(){
         expect(t.hasAll(['id','key1'])(o)).toBe(true)
      })
      it('should be false when all specified keys are not in object', function(){
         expect(t.hasAll(['id','key1','key2'])(o)).toBe(false)
      })
   })
})

describe("Core constants", function () {
   it("should return the string 'id'", function () {
      expect(t.k.id()).toEqual("id")
   })
   it("should return the string 'singleDay'", function () {
      expect(t.k.singleDay()).toEqual("singleDay")
   })
   it("should return the string 'in'", function () {
      expect(t.k. in ()).toEqual("in")
   })
   it("should return the string 'out'", function () {
      expect(t.k.out()).toEqual("out")
   })
   it("should return the string 'clockState'", function () {
      expect(t.k.state()).toEqual("clockState")
   })
   it("should return the string 'day'", function () {
      expect(t.k.day()).toEqual('day')
   })
   it("should return the string 'jobList'", function () {
      expect(t.k.jobList()).toEqual('jobList')
   })
   it("should return the string 'clockedState'", function () {
      expect(t.k.clockedState()).toEqual('clockedState')
   })
   it("should return the string 'name'", function () {
      expect(t.k.name()).toEqual('name')
   })
   it("should return the string 'clocked'", function () {
      expect(t.k.comment()).toEqual('comment')
   })
   it("should return the string 'jobActive'", function () {
      expect(t.k.jobActive()).toEqual('jobActive')
   })
})

describe('JobSettings object manipulation and creation', function(){

   var settings = t.JobSettings.new()
   var newJobSetting = settings.create(0, 'My lovely job', true)
   var job2 = settings.create(1, 't', true)

   describe('the function create', function(){
      //[t.k.id(), t.k.name(), t.k.jobActive()]
      it('should be able to create a new job setting', function(){
         expect(newJobSetting[t.k.id()]).toBe(0)
         expect(newJobSetting[t.k.name()]).toBe('My lovely job')
         expect(newJobSetting[t.k.jobActive()]).toBe(true)
      })
   })
   describe('the function add', function(){
      it('should add a new job setting to the job setting list', function(){
         expect(settings.add(newJobSetting).toArray()).toEqual([newJobSetting])
      })
   })
   describe('the function id', function(){
      it('should select the object with selected id', function(){
         settings.add(newJobSetting).add(job2)
         expect(settings.id(0).toObject().getOrElse(undefined)).toEqual(newJobSetting)
         expect(settings.id(1).toObject().getOrElse(undefined)).toEqual(job2)
      })
   })
   describe('the function update', function(){
      it('should be able to update the job name', function(){
         expect(settings.id(0).update('New Job Name').toObject().getOrElse(undefined)).toEqual({id:0, name:'New Job Name', jobActive: true})
      })
      it('should be able to update the job active status', function(){
         expect(settings.id(0).update(false).toObject().getOrElse(undefined)).toEqual({id:0, name:'New Job Name', jobActive: false})
      })
   })
})

describe('Job object manipulation and creation', function(){

   var settings = t.JobSettings.new()
   var jobSetting1 = settings.create(0, 'My lovely job', true)
   var jobSetting2 = settings.create(1, 't', true)
   settings.add(jobSetting1).add(jobSetting2)

   var jobs = t.Jobs.new()
   // (id, comment, singleDay, inOut, date)
   var job1 = jobs.create(settings, 0, '', bilby.none, t.k.out(), new Date())
   var job2 = jobs.create(settings, 1, 'My Comment', bilby.some(_.range(24).map(function(){return 1})), t.k.in(), new Date())

   describe('the function create', function(){
      it('should be able to create a valid job', function(){
         expect(job1[t.k.id()]).toBe(0)
         expect(job2[t.k.id()]).toBe(1)
         expect(job1[t.k.name()]).toBe('My lovely job')
      })
   })
   describe('the function add', function(){
      it('should add a new job to the job list', function(){
         expect(jobs.add(job1).add(job2).toArray()).toEqual([job1, job2])
      })
   })
   describe('the function id', function(){
      it('should select the job with selected id', function(){
         jobs.add(job1).add(job2)
         expect(jobs.id(0).toObject().getOrElse(undefined)).toEqual(job1)
         expect(jobs.id(1).toObject().getOrElse(undefined)).toEqual(job2)
      })
   })
   describe('the function update', function(){
      it('should be able to update the comment', function(){
         var j1 = _.cloneDeep(jobs.id(0).toObject().getOrElse(undefined))
         var j1_ = _.assign(j1, {comment: 'New comment.'})
         expect(jobs.id(0).update('New comment.').toObject().getOrElse(undefined)).toEqual(j1_)
         expect(jobs.toArray()[1]).toEqual(j1_)
      })
      it('should be able to toggle clocked in/out status', function(){
         var j1 = _.cloneDeep(jobs.id(0).toObject().getOrElse(undefined))
         var newDate = new Date(2014, 4, 2, 10)
         var dateOut = new Date(2014, 4, 2, 10, 30)
         var j1_ = _.assign(j1, {clockState: {'in': newDate}})
         expect(jobs.id(0).update(newDate).toObject().getOrElse(undefined)).toEqual(j1_)
         var singleDay_ = _.range(24).map(function(){return 0})
         singleDay_[10] = 0.5
         var j1$ = _.assign(j1_, {clockState: {'out': dateOut}}, {total: 0.5}, {singleDay: singleDay_})
         expect(jobs.id(0).update(dateOut).toObject().getOrElse(undefined)).toEqual(j1$)
         expect(jobs.toArray()[1]).toEqual(j1$)
      })
   })
})

// describe('Templates', function(){
//    describe()
// })

// describe("Core validation methods", function () {
//    describe("The function areUniqueIds", function () {
//       it("should determine if an array of objects with key 'id' is unique", function () {
//          var id = t.k.id()
//          var uniqueIds = [_.zipObject([id], [0]), _.zipObject([id], [1])]
//          var notUniqueIds = [_.zipObject([id], [0]), _.zipObject([id], [0])]
//          expect(t.O.areUniqueIds(uniqueIds)).toBe(true)
//          expect(t.O.areUniqueIds(notUniqueIds)).toBe(false)
//       })
//    })
//    describe("The function areUniqueNames", function () {
//       it("should determine if an array of objects with key 'name' is unique", function () {
//             var name = t.k.name()
//             var uniqueNames = [_.zipObject([name], ['my job']), _.zipObject([name], ['my next job'])]
//             var notUniqueNames = [_.zipObject([name], ['same old job']), _.zipObject([name], ['same old job'])]
//             expect(t.O.areUniqueNames(uniqueNames)).toBe(true)
//             expect(t.O.areUniqueNames(notUniqueNames)).toBe(false)
//          })
//    })
//       it("should validate the job ID as whole number", function () {
//           expect(t.O.validateJobId(0)).toEqual(0)
//           expect(function () {
//             t.O.validateJobId(1.5)
//           }).toThrow(new Error('Job ID: must be a whole number'))
//           expect(function () {
//             t.O.validateJobId('0')
//           }).toThrow(new Error('Job ID: must be a whole number'))
//       })
//       it("should validate the job name as a string with length greater than 0", function () {
//           var validJobName = t.O.validateJobName
//           expect(validJobName('0')).toEqual('0')
//           expect(function () {
//             return validJobName([1])
//           }).toThrow(new Error('Job Name: must be string'))
//           expect(function () {
//             validJobName('')
//           }).toThrow(new Error('Job Name: must have a length greater zero'))
//           expect(function () {
//             validJobName(0)
//           }).toThrow(new Error('Job Name: must be string, Job Name: must have a length greater zero'))
//       })
//       describe("The function validateJobList", function () {
//           var jobValues = _.curry(_.zipObject)([t.k.id(), t.k.name(), t.k.jobActive()])
//           var listOfJobs = [jobValues([0, 'My job', true]), jobValues([1, 'My Awesome Job', true])]
//           it("should validate a valid list of jobs setting and return the list", function () {
//             expect(t.O.validateJobList(listOfJobs)).toEqual(listOfJobs)
//           })
//           it("should throw the exception 'Jobs must have unique IDs' when IDs are not unique", function () {
//             expect(function () {
//                 t.O.validateJobList(_.map(_.cloneDeep(listOfJobs), function (job) {
//                     return _.assign(job, _.zipObject([t.k.id()], [0]))
//                 }))
//             }).toThrow(new Error('Jobs must have unique IDs'))
//           })
//           it("should throw the exception 'Jobs must have unique names' when names are not unique", function () {
//             expect(function () {
//                 t.O.validateJobList(_.map(_.cloneDeep(listOfJobs), function (job) {
//                     return _.assign(job, _.zipObject([t.k.name()], [0]))
//                 }))
//             }).toThrow(new Error('Jobs must have unique names'))
//           })
//       })
//       it('should validate the active job setting as a boolean', function () {
//           var validActiveJob = t.O.validateActiveJob
//           expect(validActiveJob(true)).toBe(true)
//           expect(validActiveJob(false)).toBe(false)
//           expect(function () {
//             return validActiveJob(0)
//           }).toThrow(new Error('Job Active: value must be a boolean'))
//       })
//       var singleDay = _.range(24).map(function () {
//         return 0
//     })
//     it('should validate the Single Day object as an array of numbers between -1 and 1 (inclusive) with length 24', function () {
//       var validSingleDay = t.O.validateSingleDay
//       var alternatingSingleDay = _.range(24).map(function (index) {
//           return (index % 2) ? 1 : -1
//       })
//       //length of 24
//       expect(validSingleDay(singleDay)).toEqual(singleDay)
//       expect(function () {
//           return validSingleDay(_.take(singleDay, 20))
//       }).toThrow(new Error('Single Day: Must be array of size 24'))
//       expect(function () {
//           var temp = _.clone(singleDay);
//           temp.push(0)
//           return validSingleDay(temp)
//       }).toThrow(new Error('Single Day: Must be array of size 24'))
//       //all numbers
//       expect(function () {
//           var notAllNumbers = _.clone(singleDay)
//           notAllNumbers[23] = 's'
//           return validSingleDay(notAllNumbers)
//       }).toThrow(new Error('Single Day: Must be all numbers, Single Day: Value must be between -1 and 1'))
//       //between -1 and 1 inclusive
//       expect(validSingleDay(alternatingSingleDay)).toEqual(alternatingSingleDay)
//       expect(function () {
//           return validSingleDay(alternatingSingleDay)
//       })
//     })
//     it('should validate the date object as a date', function () {
//       var newDate = new Date()
//       var validDate = t.O.validateDate
//       expect(validDate(newDate)).toEqual(newDate)
//       expect(function () {
//           return validDate('not a date')
//       }).toThrow(new Error('In: Must have valid date'))
//     })
//     var in_ = _.zipObject([t.k. in ()], [new Date()])
//     it('should validate the in/out objects', function () {
//       var out_ = _.zipObject([t.k.out()], [])
//       var notInOut = {
//           inOut: new Date()
//       }
//       var validInOut = t.O.validateClockState
//       expect(validInOut(in_)).toEqual(in_)
//       expect(validInOut(out_)).toEqual(out_)
//       expect(function () {
//           return validInOut(notInOut)
//       }).toThrow('Clock State: Must be an object type In or Out')
//     })
//     it('should validate the clock information object as an array of single day, total, and clock state', function () {
//       var singleDay = t.O.createSingleDay('')
//       var clockInfo = [singleDay, t.O.createTotal(singleDay), t.O.defaultClockInfo()]
//       var notClockInfo = _.clone(clockInfo)
//       delete notClockInfo[0]
//       var validClockInfo = t.O.validateClockInfo
//       expect(validClockInfo(clockInfo)).toEqual(clockInfo)
//       expect(function () {
//           return validClockInfo(notClockInfo)
//       }).toThrow(new Error('Clock Info: Must be an object of Clock State, Total, and Single Day'))
//     })
//     it('should validate the job information object as an array of clockInfo, id, name, and comment', function () {
//       var jobInfo = [t.O.defaultClockInfo(),
//                  t.O.createJobId(0),
//                  t.O.createJobName('Name'),
//                  t.O.createComment('')
//                 ]
//       var notJobInfo = _.clone(jobInfo)
//       delete notJobInfo[0]
//       var validJobInfo = t.O.validateJobInfo
//       expect(validJobInfo(jobInfo)).toEqual(jobInfo)
//       expect(function () {
//           return validJobInfo(notJobInfo)
//       }).toThrow(new Error('Job Info: Must have objects Clock Info, Job ID/Name, and comment'))
//     })
//     it('should validate the day array as a date and job information object', function () {
//       var dayArray = [new Date(), [_.zipObject([t.k.id()], [0]), _.zipObject([t.k.id()], [1])]]
//       var notDayArray = _.clone(dayArray);
//       delete notDayArray[1]
//       var validDay = t.O.validateDay
//       expect(validDay(dayArray)).toEqual(dayArray)
//       expect(function () {
//           return validDay(notDayArray)
//       }).toThrow(new Error('Day: Must have unique IDs, Day: Must have date and job list'))
//     })
// })
// 
// describe("Core object creation", function () {
//     it("should create a job ID object as whole number", function () {
//       expect(t.O.createJobId(0)).toEqual(_.zipObject([t.k.id()], [0]))
//       expect(function () {
//           t.O.createJobId(1.5)
//       }).toThrow(new Error('Job ID: must be a whole number'))
//       expect(function () {
//           t.O.createJobId('0')
//       }).toThrow(new Error('Job ID: must be a whole number'))
//     })
//     it('should create the Single Day object ({singleDay: [0..23]}) as an array of numbers between -1 and 1 (inclusive) with length 24', function () {
//       var alternatingSingleDay = _.range(24).map(function (index) {
//           return (index % 2) ? 1 : -1
//       })
//       //length of 24
//       expect(t.O.createSingleDay(alternatingSingleDay)).toEqual(_.zipObject([t.k.singleDay()], [alternatingSingleDay]))
//       expect(t.O.createSingleDay([])).toEqual(_.zipObject([t.k.singleDay()], [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]))
//       expect(function () {
//           return t.O.createSingleDay(_.take(alternatingSingleDay, 20))
//       }).toThrow(new Error('Single Day: Must be array of size 24'))
//       expect(function () {
//           var temp = _.clone(alternatingSingleDay);
//           temp.push(0)
//           return t.O.createSingleDay(temp)
//       }).toThrow(new Error('Single Day: Must be array of size 24'))
//       //all numbers
//       expect(function () {
//           var notAllNumbers = _.clone(alternatingSingleDay);
//           notAllNumbers[23] = 's'
//           return t.O.createSingleDay(notAllNumbers)
//       }).toThrow(new Error('Single Day: Must be all numbers, Single Day: Value must be between -1 and 1'))
//     })
//     describe('The function createTotal', function () {
//       it('should create a total object from the single day object', function () {
//           var singleDay = t.O.createSingleDay(_.range(24).map(function () {
//           return 1
//           }))
//           expect(t.O.createTotal(singleDay)).toEqual({
//           total: 24
//           })
//       })
//     })
//     it('should create an "in" object with a date', function () {
//       var newDate = new Date()
//       expect(t.O.createIn(newDate)).toEqual(_.zipObject([t.k. in ()], [newDate]))
//       expect(function () {
//           return t.O.createIn('not a date')
//       }).toThrow(new Error('In: Must have valid date'))
//     })
//     it('should create an "out" object with an empty value', function () {
//       expect(t.O.createOut()).toEqual(_.zipObject([t.k.out()], ['']))
//     })
//     it('should create clock state object containing an in or out object', function () {
//       var newDate = new Date()
//       var in_ = _.zipObject([t.k. in ()], [newDate])
//       var out_ = _.zipObject([t.k.out()], [''])
//       expect(t.O.createClockState(in_)).toEqual(_.zipObject([t.k.state()], [in_]))
//       expect(t.O.createClockState(out_)).toEqual(_.zipObject([t.k.state()], [out_]))
//       expect(function () {
//           return t.O.createClockState({
//             notInOut: ''
//           })
//         }).toThrow('Clock State: Must be an object type In or Out')
//     })
//     it('should validate the clock information object as an array of single day, total, and clock state', function () {
//         var state = t.O.createClockState(t.O.createOut())
//         var singleDay = t.O.createSingleDay('')
//         var total = t.O.createTotal(singleDay)
//         var clockInfo = _.assign(singleDay, total, state)
//         expect(t.O.createClockInfo(singleDay, total, state)).toEqual(clockInfo)
//         expect(function () {
//           return t.O.createClockInfo({
//               notSingleDay: ''
//           }, {
//               notInOut: ''
//           })
//         }).toThrow(new Error('Clock Info: Must be an object of Clock State, Total, and Single Day'))
//     })
//     it('should create job information object from clockInfo, id, job name, and comment objects', function () {
//         var jobInfo = [t.O.defaultClockInfo(),
//                    t.O.createJobId(0),
//                    t.O.createJobName('Name'),
//                    t.O.createComment('')
//                   ]
//         expect(t.O.createJobInfo(jobInfo[0], jobInfo[1], jobInfo[2], jobInfo[3])).toEqual(_.assign.apply(null, jobInfo))
//         expect(function () {
//           return t.O.createJobInfo({
//               notClock: ''
//           }, {
//               notJobId: ''
//           })
//         }).toThrow(new Error('Job Info: Must have objects Clock Info, Job ID/Name, and comment'))
//     })
//     it('should create the day object as a date and list of job information objects', function () {
//         var newDate = new Date()
//         var jobInfo = t.O.defaultJobInfo()
//         var jobInfo2 = _.assign(_.clone(jobInfo), _.zipObject([t.k.id()], [1]))
//         var listOfJobInfo = [jobInfo, jobInfo2]
//         expect(t.O.createDay(newDate, listOfJobInfo)).toEqual(_.zipObject([t.k.day(), t.k.jobList()], [newDate, [jobInfo, jobInfo2]]))
//         expect(function () {
//           return t.O.createDay('s', listOfJobInfo)
//         }).toThrow(new Error('Day: Must have date and job list'))
//         expect(function () {
//           return t.O.createDay(newDate, [jobInfo, jobInfo])
//         }).toThrow(new Error('Day: Must have unique IDs'))
//     })
// })
// 
// describe('Main engine for time card', function () {
//     var newDate = new Date(2014, 2, 6, 16, 15, 0)
//     var outDate = new Date(2014, 2, 6, 18, 15, 0)
//     var clockedInState = t.O.createClockState(t.O.createIn(newDate))
//     var clockedOutState_ = t.O.createClockState(t.O.createOut())
//     var singleDay = t.O.createSingleDay('')
//     var clockInfoOut = t.O.defaultClockInfo()
//     var clockInfoIn = t.O.createClockInfo(singleDay, t.O.createTotal(singleDay), clockedInState)
//     var singleDayOut = t.O.createSingleDay([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.75, 1.0, 0.25, 0, 0, 0, 0, 0])
//     var result = _.assign(t.O.defaultClockInfo(), singleDayOut, t.O.createTotal(singleDayOut))
//     describe('createClockedInState: Create clocked in state', function () {
//         it('should create designated time at stated time', function () {
//           expect(t.O.inState(newDate)).toEqual(clockedInState)
//         })
//     })
//     describe('clockedOutState:', function () {
//         it('should create clockState object with out object', function () {
//           expect(t.O.outState()).toEqual(clockedOutState_)
//         })
//     })
//     describe('defaultClockInfo:', function () {
//         it('should create a default clock information object which is clocked out', function () {
//           var singleDay = t.O.createSingleDay('')
//           expect(t.O.defaultClockInfo()).toEqual(t.O.createClockInfo(singleDay, t.O.createTotal(singleDay), clockedOutState_))
//         })
//     })
//     describe('isClockedIn:', function () {
//         it('should determine if clock state is clocked in ', function () {
//           expect(t.Clock.isClockedIn(clockedInState)).toBe(true)
//         })
//         it('should determine if clock state is clocked out', function () {
//           expect(t.Clock.isClockedIn(t.O.outState())).toBe(false)
//         })
//     })
//     describe('clockIn:', function () {
//         it('should clock in clock information which is clocked out', function () {
//           expect(t.Clock. in (clockInfoOut, newDate)).toEqual(clockInfoIn)
//         })
//         it('should create a new clock information object if one is not provided', function () {
//           expect(t.Clock. in ('', newDate)).toEqual(clockInfoIn)
//         })
//     })
//     describe('clockOut:', function () {
//         it('should return a "clock information" object with added time which clock state\'s is out', function () {
//           expect(t.Clock.out(clockInfoIn, outDate)).toEqual(result)
//         })
//         it('should return the correct time when clocking in and out during the same hour', function () {
//           var singleDay = t.O.createSingleDay([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0])
//           expect(t.Clock.out(clockInfoIn, new Date(2014, 2, 6, 16, 45, 0))).toEqual(_.assign(t.O.defaultClockInfo(), singleDay, t.O.createTotal(singleDay)))
//         })
//     })
//     describe('toggleClock:', function () {
//         it('should return a clocked in clock information when toggling from out', function () {
//           expect(t.Clock.toggle(t.O.defaultClockInfo(), newDate)).toEqual(_.assign(t.O.defaultClockInfo(), t.O.inState(newDate)))
//         })
//         it('should return a clocked out clock information with updated hours when toggling from in', function () {
//           expect(t.Clock.toggle(clockInfoIn, outDate)).toEqual(result)
//         })
//     })
// })
