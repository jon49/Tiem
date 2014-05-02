/* brackets-xunit: jasmine */
/* brackets-xunit: includes=../bower_components/lodash/dist/lodash.min.js,../bower_components/bilby.js/bilby-min.js,utilities.js,constraints.js,objects.js,engine.js */

/* global describe, it, expect, Tiem, _ */
/*jslint asi: true*/
/*jshint indent:3, curly:false, laxbreak:true */

describe("How the utilities are used in project", function () {
   //stringSize
   it('should trim and cut words which are too long', function () {
      expect(Tiem.stringSize(' yes! ', 3)).toEqual('yes')
   })
   it('should be able to trim without cutting', function () {
      expect(Tiem.stringSize(' yes! ', 4)).toEqual('yes!')
   })
   it('should leave alone a string without leading/following white space which isn\'t to long', function () {
      expect(Tiem.stringSize('yes !', 5)).toEqual('yes !')
   })
   //isWholeNumber
   it('should return true when a whole number is given', function () {
      expect(Tiem.isWholeNumber(3)).toEqual(true)
   })
   it('should return false when given number which is not a whole number', function () {
      expect(Tiem.isWholeNumber(3.14)).toEqual(false)
   })
   it('should return false when given an item which is not a number', function () {
      expect(Tiem.isWholeNumber('3')).toEqual(false)
   })
   //isBetween
   it('should tell if a number is in between two numbers', function () {
      expect(Tiem.isBetween(2, 4, 3)).toBe(true)
   })
   it('should tell if a number is in between or equal to two numbers', function () {
      expect(Tiem.isBetween(2, 4, 2) && Tiem.isBetween(2, 4, 4)).toBe(true)
   })
   it('should tell if a number is outside the bounds of two numbers', function () {
      expect(Tiem.isBetween(2, 4, 1) && Tiem.isBetween(2, 4, 5)).toBe(false)
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

      expect(Tiem.areUnique(uniqueObject, 'dogName')).toBe(true)
      expect(Tiem.areUnique(uniqueObjects, 'dogName')).toBe(true)
      expect(Tiem.areUnique(notUniqueObjects, 'dogName')).not.toBe(true)
   })
   it('should convert arguments to array and flatten array', function () {
      var test = function () {
       return Tiem.toFlatArray(arguments)
      }
      expect(test(1, [2])).toEqual([1, 2])
   })
   it('should negate a function.', function () {
      var isNotString = Tiem.complement(_.isString)
      expect(isNotString(0)).toBe(true)
      expect(isNotString('s')).toBe(false)
   })
   describe("The function addRollingArray", function () {
      var array = [0.5, 0, 0, 0]
      it('should add rolling values to an array from beginning through the last index', function () {
         expect(Tiem.addRollingArray(array, 1.5, 4, 1)).toEqual([0.5, 0.5, 1, 1])
      })
      it('should do partial adding at the beginning and end of the array when start and end are not integers', function () {
         expect(Tiem.addRollingArray(array, 1.5, 3.5, 1)).toEqual([0.5, 0.5, 1, 0.5])
      })
      it('should add to previous values when within start and end values and be able to add full value to beginning of an array', function () {
         var array2 = _.clone(array);
         array2.push(5);
         array2[0] = 2
         expect(Tiem.addRollingArray(array2, 0, 3.5, 1)).toEqual([3, 1, 1, 0.5, 5])
      })
      it('should add the difference of the starting and ending points when they are on the same index', function () {
         expect(Tiem.addRollingArray(array, 0, 0.25, 1)).toEqual([0.75, 0, 0, 0])
      })
   })
   describe("fractionalHours", function () {
      it('should convert a date to a fractional hour value down to the seconds', function () {
         expect(Tiem.fractionalHours(new Date(2014, 3, 6, 15, 15, 36))).toEqual(15.26)
      })
   })
   describe("sum", function () {
      it("should add the elements in an array", function () {
         expect(Tiem.sum([1, 2, 3])).toEqual(6)
      })
      it("should reject elements which are not numbers", function () {
         expect(Tiem.sum([1, 2, '3', 'a'])).toEqual(6)
      })
   })
   describe("The function areUniqueValues", function () {
      it("should return a function which evaluates an array of objects given a certain key - true when all unique", function () {
         expect(Tiem.areUniqueValues('myKey')([{
            myKey: 1
         }, {
            myKey: 2
         }])).toBe(true)
      })
      it("should return a function which evaluates an array of objects given a certain key - false when not unique", function () {
         expect(Tiem.areUniqueValues('myKey')([{
            myKey: 2
         }, {
            myKey: 2
         }])).toBe(false)
      })
   })
   describe("The function zipObjectT", function () {
      it("should map an array to a key and value functions and return an object", function () {
         expect(Tiem.zipObjectT(_.identity, function () {
            return ', world!'
         }, ['Hello'])).toEqual({
            Hello: ', world!'
         })
      })
   })
   describe("The function constants", function () {
      it("should return a function of constant value", function () {
         var keys = Tiem.constants([['yep', 'yay!'], ['nope']])
         expect(keys.yep()).toEqual('yay!')
      })
   })
})

describe("Contraints", function () {
   var throwString = 'This is a test.'
   var testFunction = _.isNumber
   var isValid = Tiem.Constraints.validator(throwString, testFunction)
   var num = _.partial(Tiem.Constraints.condition1(isValid), _.identity)
   it("should return a predicate closure with a message property", function () {
      expect(isValid.message).toBe(throwString)
      expect(isValid(0)).toBe(true)
      expect(isValid('nope')).toBe(false)
   })
   it("should return an empty array when valid", function () {
      expect(num(0)).toEqual(0)
   })
   it("should throw an error when not valid", function () {
      expect(function () {
         num('not a number')
      }).toThrow(new Error(throwString))
   })
   it("should accept an array of validator arguments and return an identity partial application of condition1", function () {
      expect(Tiem.Constraints.conditions([throwString, testFunction])(0)).toEqual(0)
      expect(function () {
         return Tiem.Constraints.conditions([throwString, testFunction])('not a number')
      })
         .toThrow(new Error(throwString))
   })
})

describe("Core constants", function () {
   it("should return the string 'id'", function () {
      expect(Tiem.k.jobId()).toEqual("jobId")
   })
   it("should return the string 'singleDay'", function () {
      expect(Tiem.k.singleDay()).toEqual("singleDay")
   })
   it("should return the string 'in'", function () {
      expect(Tiem.k. in ()).toEqual("in")
   })
   it("should return the string 'out'", function () {
      expect(Tiem.k.out()).toEqual("out")
   })
   it("should return the string 'clockState'", function () {
      expect(Tiem.k.state()).toEqual("clockState")
   })
   it("should return the string 'day'", function () {
      expect(Tiem.k.day()).toEqual('day')
   })
   it("should return the string 'jobList'", function () {
      expect(Tiem.k.jobList()).toEqual('jobList')
   })
   it("should return the string 'clockedState'", function () {
      expect(Tiem.k.clockedState()).toEqual('clockedState')
   })
   it("should return the string 'jobName'", function () {
      expect(Tiem.k.jobName()).toEqual('jobName')
   })
   it("should return the string 'clocked'", function () {
      expect(Tiem.k.comment()).toEqual('comment')
   })
   it("should return the string 'jobActive'", function () {
      expect(Tiem.k.jobActive()).toEqual('jobActive')
   })
})

describe('JobSettings object manipulation and creation', function(){

   var settings = Tiem.O.JobSettings.JobSettings()
   var newJobSetting = settings.create(0, 'My lovely job', true)
   var job2 = settings.create(1, 'Tiem', true)

   describe('the function create', function(){
      //[Tiem.k.jobId(), Tiem.k.jobName(), Tiem.k.jobActive()]
      it('should be able to create a new job setting', function(){
         expect(newJobSetting[Tiem.k.jobId()]).toBe(0)
         expect(newJobSetting[Tiem.k.jobName()]).toBe('My lovely job')
         expect(newJobSetting[Tiem.k.jobActive()]).toBe(true)
      })
   })
   describe('the function add', function(){
      it('should add a new job setting to the job setting list', function(){
         expect(settings.add(newJobSetting).toList()).toEqual([newJobSetting])
      })
   })
   describe('the function id', function(){
      it('should select the object with selected id', function(){
         settings.add(newJobSetting).add(job2)
         expect(settings.id(0).toObject()).toEqual(newJobSetting)
         expect(settings.id(1).toObject()).toEqual(job2)
      })
   })
   describe('the function change', function(){
      it('should be able to update the job name', function(){
         expect(settings.id(0).change('New Job Name').toObject()).toEqual({jobId:0, jobName:'New Job Name', jobActive: true})
      })
      it('should be able to update the job active status', function(){
         expect(settings.id(0).change(false).toObject()).toEqual({jobId:0, jobName:'New Job Name', jobActive: false})
      })
   })
})

describe('Job object manipulation and creation', function(){

   var settings = Tiem.O.JobSettings.JobSettings()
   var jobSetting1 = settings.create(0, 'My lovely job', true)
   var jobSetting2 = settings.create(1, 'Tiem', true)
   settings.add(jobSetting1).add(jobSetting2)

   var jobs = Tiem.O.Jobs.Jobs()
   // (id, comment, singleDay, inOut, date)
   var job1 = jobs.create(settings, 0, '', bilby.none, Tiem.k.in(), new Date())
   var job2 = jobs.create(settings, 1, 'My Comment', bilby.some(_.range(24).map(function(){return 1})), Tiem.k.out(), new Date())

   describe('the function create', function(){
      it('should be able to create a valid job', function(){
         expect(job1[Tiem.k.jobId()]).toBe(0)
         expect(job2[Tiem.k.jobId()]).toBe(1)
         expect(job1[Tiem.k.jobName()]).toBe('My lovely job')
      })
   })

//   describe('the function add', function(){
//      it('should add a new job setting to the job setting list', function(){
//         expect(settings.add(newJobSetting).toList()).toEqual([newJobSetting])
//      })
//   })
//   describe('the function id', function(){
//      it('should select the object with selected id', function(){
//         settings.add(newJobSetting).add(job2)
//         expect(settings.id(0).toObject()).toEqual(newJobSetting)
//         expect(settings.id(1).toObject()).toEqual(job2)
//      })
//   })
//   describe('the function change', function(){
//      it('should be able to update the job name', function(){
//         expect(settings.id(0).change('New Job Name').toObject()).toEqual({jobId:0, jobName:'New Job Name', jobActive: true})
//      })
//      it('should be able to update the job active status', function(){
//         expect(settings.id(0).change(false).toObject()).toEqual({jobId:0, jobName:'New Job Name', jobActive: false})
//      })
//   })
})

describe("Core validation methods", function () {
   describe("The function areUniqueIds", function () {
      it("should determine if an array of objects with key 'jobId' is unique", function () {
         var id = Tiem.k.jobId()
         var uniqueIds = [_.zipObject([id], [0]), _.zipObject([id], [1])]
         var notUniqueIds = [_.zipObject([id], [0]), _.zipObject([id], [0])]
         expect(Tiem.O.areUniqueIds(uniqueIds)).toBe(true)
         expect(Tiem.O.areUniqueIds(notUniqueIds)).toBe(false)
      })
   })
   describe("The function areUniqueNames", function () {
      it("should determine if an array of objects with key 'jobName' is unique", function () {
            var name = Tiem.k.jobName()
            var uniqueNames = [_.zipObject([name], ['my job']), _.zipObject([name], ['my next job'])]
            var notUniqueNames = [_.zipObject([name], ['same old job']), _.zipObject([name], ['same old job'])]
            expect(Tiem.O.areUniqueNames(uniqueNames)).toBe(true)
            expect(Tiem.O.areUniqueNames(notUniqueNames)).toBe(false)
         })
   })
      it("should validate the job ID as whole number", function () {
          expect(Tiem.O.validateJobId(0)).toEqual(0)
          expect(function () {
            Tiem.O.validateJobId(1.5)
          }).toThrow(new Error('Job ID: must be a whole number'))
          expect(function () {
            Tiem.O.validateJobId('0')
          }).toThrow(new Error('Job ID: must be a whole number'))
      })
      it("should validate the job name as a string with length greater than 0", function () {
          var validJobName = Tiem.O.validateJobName
          expect(validJobName('0')).toEqual('0')
          expect(function () {
            return validJobName([1])
          }).toThrow(new Error('Job Name: must be string'))
          expect(function () {
            validJobName('')
          }).toThrow(new Error('Job Name: must have a length greater zero'))
          expect(function () {
            validJobName(0)
          }).toThrow(new Error('Job Name: must be string, Job Name: must have a length greater zero'))
      })
      describe("The function validateJobList", function () {
          var jobValues = _.curry(_.zipObject)([Tiem.k.jobId(), Tiem.k.jobName(), Tiem.k.jobActive()])
          var listOfJobs = [jobValues([0, 'My job', true]), jobValues([1, 'My Awesome Job', true])]
          it("should validate a valid list of jobs setting and return the list", function () {
            expect(Tiem.O.validateJobList(listOfJobs)).toEqual(listOfJobs)
          })
          it("should throw the exception 'Jobs must have unique IDs' when IDs are not unique", function () {
            expect(function () {
                Tiem.O.validateJobList(_.map(_.cloneDeep(listOfJobs), function (job) {
                    return _.assign(job, _.zipObject([Tiem.k.jobId()], [0]))
                }))
            }).toThrow(new Error('Jobs must have unique IDs'))
          })
          it("should throw the exception 'Jobs must have unique names' when names are not unique", function () {
            expect(function () {
                Tiem.O.validateJobList(_.map(_.cloneDeep(listOfJobs), function (job) {
                    return _.assign(job, _.zipObject([Tiem.k.jobName()], [0]))
                }))
            }).toThrow(new Error('Jobs must have unique names'))
          })
      })
      it('should validate the active job setting as a boolean', function () {
          var validActiveJob = Tiem.O.validateActiveJob
          expect(validActiveJob(true)).toBe(true)
          expect(validActiveJob(false)).toBe(false)
          expect(function () {
            return validActiveJob(0)
          }).toThrow(new Error('Job Active: value must be a boolean'))
      })
      var singleDay = _.range(24).map(function () {
        return 0
    })
    it('should validate the Single Day object as an array of numbers between -1 and 1 (inclusive) with length 24', function () {
      var validSingleDay = Tiem.O.validateSingleDay
      var alternatingSingleDay = _.range(24).map(function (index) {
          return (index % 2) ? 1 : -1
      })
      //length of 24
      expect(validSingleDay(singleDay)).toEqual(singleDay)
      expect(function () {
          return validSingleDay(_.take(singleDay, 20))
      }).toThrow(new Error('Single Day: Must be array of size 24'))
      expect(function () {
          var temp = _.clone(singleDay);
          temp.push(0)
          return validSingleDay(temp)
      }).toThrow(new Error('Single Day: Must be array of size 24'))
      //all numbers
      expect(function () {
          var notAllNumbers = _.clone(singleDay)
          notAllNumbers[23] = 's'
          return validSingleDay(notAllNumbers)
      }).toThrow(new Error('Single Day: Must be all numbers, Single Day: Value must be between -1 and 1'))
      //between -1 and 1 inclusive
      expect(validSingleDay(alternatingSingleDay)).toEqual(alternatingSingleDay)
      expect(function () {
          return validSingleDay(alternatingSingleDay)
      })
    })
    it('should validate the date object as a date', function () {
      var newDate = new Date()
      var validDate = Tiem.O.validateDate
      expect(validDate(newDate)).toEqual(newDate)
      expect(function () {
          return validDate('not a date')
      }).toThrow(new Error('In: Must have valid date'))
    })
    var in_ = _.zipObject([Tiem.k. in ()], [new Date()])
    it('should validate the in/out objects', function () {
      var out_ = _.zipObject([Tiem.k.out()], [])
      var notInOut = {
          inOut: new Date()
      }
      var validInOut = Tiem.O.validateClockState
      expect(validInOut(in_)).toEqual(in_)
      expect(validInOut(out_)).toEqual(out_)
      expect(function () {
          return validInOut(notInOut)
      }).toThrow('Clock State: Must be an object type In or Out')
    })
    it('should validate the clock information object as an array of single day, total, and clock state', function () {
      var singleDay = Tiem.O.createSingleDay('')
      var clockInfo = [singleDay, Tiem.O.createTotal(singleDay), Tiem.O.defaultClockInfo()]
      var notClockInfo = _.clone(clockInfo)
      delete notClockInfo[0]
      var validClockInfo = Tiem.O.validateClockInfo
      expect(validClockInfo(clockInfo)).toEqual(clockInfo)
      expect(function () {
          return validClockInfo(notClockInfo)
      }).toThrow(new Error('Clock Info: Must be an object of Clock State, Total, and Single Day'))
    })
    it('should validate the job information object as an array of clockInfo, jobId, jobName, and comment', function () {
      var jobInfo = [Tiem.O.defaultClockInfo(),
                 Tiem.O.createJobId(0),
                 Tiem.O.createJobName('Name'),
                 Tiem.O.createComment('')
                ]
      var notJobInfo = _.clone(jobInfo)
      delete notJobInfo[0]
      var validJobInfo = Tiem.O.validateJobInfo
      expect(validJobInfo(jobInfo)).toEqual(jobInfo)
      expect(function () {
          return validJobInfo(notJobInfo)
      }).toThrow(new Error('Job Info: Must have objects Clock Info, Job ID/Name, and comment'))
    })
    it('should validate the day array as a date and job information object', function () {
      var dayArray = [new Date(), [_.zipObject([Tiem.k.jobId()], [0]), _.zipObject([Tiem.k.jobId()], [1])]]
      var notDayArray = _.clone(dayArray);
      delete notDayArray[1]
      var validDay = Tiem.O.validateDay
      expect(validDay(dayArray)).toEqual(dayArray)
      expect(function () {
          return validDay(notDayArray)
      }).toThrow(new Error('Day: Must have unique IDs, Day: Must have date and job list'))
    })
})

describe("Core object creation", function () {
    it("should create a job ID object as whole number", function () {
      expect(Tiem.O.createJobId(0)).toEqual(_.zipObject([Tiem.k.jobId()], [0]))
      expect(function () {
          Tiem.O.createJobId(1.5)
      }).toThrow(new Error('Job ID: must be a whole number'))
      expect(function () {
          Tiem.O.createJobId('0')
      }).toThrow(new Error('Job ID: must be a whole number'))
    })
    it('should create the Single Day object ({singleDay: [0..23]}) as an array of numbers between -1 and 1 (inclusive) with length 24', function () {
      var alternatingSingleDay = _.range(24).map(function (index) {
          return (index % 2) ? 1 : -1
      })
      //length of 24
      expect(Tiem.O.createSingleDay(alternatingSingleDay)).toEqual(_.zipObject([Tiem.k.singleDay()], [alternatingSingleDay]))
      expect(Tiem.O.createSingleDay([])).toEqual(_.zipObject([Tiem.k.singleDay()], [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]))
      expect(function () {
          return Tiem.O.createSingleDay(_.take(alternatingSingleDay, 20))
      }).toThrow(new Error('Single Day: Must be array of size 24'))
      expect(function () {
          var temp = _.clone(alternatingSingleDay);
          temp.push(0)
          return Tiem.O.createSingleDay(temp)
      }).toThrow(new Error('Single Day: Must be array of size 24'))
      //all numbers
      expect(function () {
          var notAllNumbers = _.clone(alternatingSingleDay);
          notAllNumbers[23] = 's'
          return Tiem.O.createSingleDay(notAllNumbers)
      }).toThrow(new Error('Single Day: Must be all numbers, Single Day: Value must be between -1 and 1'))
    })
    describe('The function createTotal', function () {
      it('should create a total object from the single day object', function () {
          var singleDay = Tiem.O.createSingleDay(_.range(24).map(function () {
          return 1
          }))
          expect(Tiem.O.createTotal(singleDay)).toEqual({
          total: 24
          })
      })
    })
    it('should create an "in" object with a date', function () {
      var newDate = new Date()
      expect(Tiem.O.createIn(newDate)).toEqual(_.zipObject([Tiem.k. in ()], [newDate]))
      expect(function () {
          return Tiem.O.createIn('not a date')
      }).toThrow(new Error('In: Must have valid date'))
    })
    it('should create an "out" object with an empty value', function () {
      expect(Tiem.O.createOut()).toEqual(_.zipObject([Tiem.k.out()], ['']))
    })
    it('should create clock state object containing an in or out object', function () {
      var newDate = new Date()
      var in_ = _.zipObject([Tiem.k. in ()], [newDate])
      var out_ = _.zipObject([Tiem.k.out()], [''])
      expect(Tiem.O.createClockState(in_)).toEqual(_.zipObject([Tiem.k.state()], [in_]))
      expect(Tiem.O.createClockState(out_)).toEqual(_.zipObject([Tiem.k.state()], [out_]))
      expect(function () {
          return Tiem.O.createClockState({
            notInOut: ''
          })
        }).toThrow('Clock State: Must be an object type In or Out')
    })
    it('should validate the clock information object as an array of single day, total, and clock state', function () {
        var state = Tiem.O.createClockState(Tiem.O.createOut())
        var singleDay = Tiem.O.createSingleDay('')
        var total = Tiem.O.createTotal(singleDay)
        var clockInfo = _.assign(singleDay, total, state)
        expect(Tiem.O.createClockInfo(singleDay, total, state)).toEqual(clockInfo)
        expect(function () {
          return Tiem.O.createClockInfo({
              notSingleDay: ''
          }, {
              notInOut: ''
          })
        }).toThrow(new Error('Clock Info: Must be an object of Clock State, Total, and Single Day'))
    })
    it('should create job information object from clockInfo, jobId, job name, and comment objects', function () {
        var jobInfo = [Tiem.O.defaultClockInfo(),
                   Tiem.O.createJobId(0),
                   Tiem.O.createJobName('Name'),
                   Tiem.O.createComment('')
                  ]
        expect(Tiem.O.createJobInfo(jobInfo[0], jobInfo[1], jobInfo[2], jobInfo[3])).toEqual(_.assign.apply(null, jobInfo))
        expect(function () {
          return Tiem.O.createJobInfo({
              notClock: ''
          }, {
              notJobId: ''
          })
        }).toThrow(new Error('Job Info: Must have objects Clock Info, Job ID/Name, and comment'))
    })
    it('should create the day object as a date and list of job information objects', function () {
        var newDate = new Date()
        var jobInfo = Tiem.O.defaultJobInfo()
        var jobInfo2 = _.assign(_.clone(jobInfo), _.zipObject([Tiem.k.jobId()], [1]))
        var listOfJobInfo = [jobInfo, jobInfo2]
        expect(Tiem.O.createDay(newDate, listOfJobInfo)).toEqual(_.zipObject([Tiem.k.day(), Tiem.k.jobList()], [newDate, [jobInfo, jobInfo2]]))
        expect(function () {
          return Tiem.O.createDay('s', listOfJobInfo)
        }).toThrow(new Error('Day: Must have date and job list'))
        expect(function () {
          return Tiem.O.createDay(newDate, [jobInfo, jobInfo])
        }).toThrow(new Error('Day: Must have unique IDs'))
    })
})

describe('Main engine for time card', function () {
    var newDate = new Date(2014, 2, 6, 16, 15, 0)
    var outDate = new Date(2014, 2, 6, 18, 15, 0)
    var clockedInState = Tiem.O.createClockState(Tiem.O.createIn(newDate))
    var clockedOutState_ = Tiem.O.createClockState(Tiem.O.createOut())
    var singleDay = Tiem.O.createSingleDay('')
    var clockInfoOut = Tiem.O.defaultClockInfo()
    var clockInfoIn = Tiem.O.createClockInfo(singleDay, Tiem.O.createTotal(singleDay), clockedInState)
    var singleDayOut = Tiem.O.createSingleDay([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.75, 1.0, 0.25, 0, 0, 0, 0, 0])
    var result = _.assign(Tiem.O.defaultClockInfo(), singleDayOut, Tiem.O.createTotal(singleDayOut))
    describe('createClockedInState: Create clocked in state', function () {
        it('should create designated time at stated time', function () {
          expect(Tiem.O.inState(newDate)).toEqual(clockedInState)
        })
    })
    describe('clockedOutState:', function () {
        it('should create clockState object with out object', function () {
          expect(Tiem.O.outState()).toEqual(clockedOutState_)
        })
    })
    describe('defaultClockInfo:', function () {
        it('should create a default clock information object which is clocked out', function () {
          var singleDay = Tiem.O.createSingleDay('')
          expect(Tiem.O.defaultClockInfo()).toEqual(Tiem.O.createClockInfo(singleDay, Tiem.O.createTotal(singleDay), clockedOutState_))
        })
    })
    describe('isClockedIn:', function () {
        it('should determine if clock state is clocked in ', function () {
          expect(Tiem.Clock.isClockedIn(clockedInState)).toBe(true)
        })
        it('should determine if clock state is clocked out', function () {
          expect(Tiem.Clock.isClockedIn(Tiem.O.outState())).toBe(false)
        })
    })
    describe('clockIn:', function () {
        it('should clock in clock information which is clocked out', function () {
          expect(Tiem.Clock. in (clockInfoOut, newDate)).toEqual(clockInfoIn)
        })
        it('should create a new clock information object if one is not provided', function () {
          expect(Tiem.Clock. in ('', newDate)).toEqual(clockInfoIn)
        })
    })
    describe('clockOut:', function () {
        it('should return a "clock information" object with added time which clock state\'s is out', function () {
          expect(Tiem.Clock.out(clockInfoIn, outDate)).toEqual(result)
        })
        it('should return the correct time when clocking in and out during the same hour', function () {
          var singleDay = Tiem.O.createSingleDay([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0])
          expect(Tiem.Clock.out(clockInfoIn, new Date(2014, 2, 6, 16, 45, 0))).toEqual(_.assign(Tiem.O.defaultClockInfo(), singleDay, Tiem.O.createTotal(singleDay)))
        })
    })
    describe('toggleClock:', function () {
        it('should return a clocked in clock information when toggling from out', function () {
          expect(Tiem.Clock.toggle(Tiem.O.defaultClockInfo(), newDate)).toEqual(_.assign(Tiem.O.defaultClockInfo(), Tiem.O.inState(newDate)))
        })
        it('should return a clocked out clock information with updated hours when toggling from in', function () {
          expect(Tiem.Clock.toggle(clockInfoIn, outDate)).toEqual(result)
        })
    })
})
