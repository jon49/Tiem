/* brackets-xunit: jasmine */
/* brackets-xunit: includes=../bower_components/lodash/dist/lodash.js,../bower_components/bilby.js/bilby.js,../bower_components/mithril/mithril.js,utilities.js,objects.js,controller.js,events.js,ui.js */

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
   describe('The function singleTagged', function(){
      it('should create an object with a single key', function(){
         expect(t.singleTagged('id')(1)).toEqual({id: 1})
      })
   })
   describe('The function zipOverObject', function(){
      var o1 = {id:1, name: 'jon', last:'nyman'}
      var o2 = {id:2, name: 'laura', book:'I love'}
      var o = t.zipOverObject(o1, o2)
      it('should combine two objects without changing the originals', function(){
         expect(o1).toEqual({id:1, name: 'jon', last:'nyman'})
         expect(o2).toEqual({id:2, name: 'laura', book:'I love'})
      })
      it('should combine the two object making any repetitive object into an array', function(){
         expect(o).toEqual({id:[1, 2], name:['jon', 'laura'], last:'nyman', book:'I love'})
      })
   })
   describe('The function zipOverObjects', function(){
      var o1 = {id:1, name: 'jon', last:'nyman'}
      var o2 = {id:2, name: 'laura', book:'I love'}
      var o = t.zipOverObjects([o1, o2])
      it('should combine two objects without changing the originals', function(){
         expect(o1).toEqual({id:1, name: 'jon', last:'nyman'})
         expect(o2).toEqual({id:2, name: 'laura', book:'I love'})
      })
      it('should combine the two object making any repetitive object into an array', function(){
         expect(o).toEqual({id:[1, 2], name:['jon', 'laura'], last:'nyman', book:'I love'})
      })
   })
   describe('The function isNonEmpty', function(){
      it('should return true when it has a value', function(){
         expect(t.isSomething('a')).toBe(true)
      })
      it('should return false when it is empty', function(){
         expect(t.isSomething('')).toBe(false)
      })
   })
   describe('The function isSomeString', function(){
      it('should return true when there is a string of length greater than 0', function(){
         expect(t.isSomeString('1')).toBe(true)
      })
      it("should return false when there isn't a string of length greater than 0", function(){
         expect(t.isSomeString('')).toBe(false)
      })
   })
})

//describe('Core mithril extensions', function(){
//   describe('The function parseM', function(){
//      it('should create a mithril virtual element', function(){
//         var el = mm.tag('#id'),
//             cls = mm.class('color'),
//             cls2 = mm.class('other-class'),
//             val = mm.value('laura'),
//             combined = zipOverObjects([el, cls, cls2, val])
//         var m_ = mm.parse(combined)
//         expect(combined).toEqual({ tag: '#id', class : [ 'color', 'other-class' ], value : 'laura' })
//         expect(m_).toEqual({tag:'div', attrs:{id:'id', 'class':' color other-class'}, children:'laura'})
//      })
//   })
//})

describe("Core constants", function () {
   it("should return the string 'id'", function () {
      expect(t.k.id()).toEqual("id")
   })
   it("should return the string 'singleDay'", function () {
      expect(t.k.singleDay()).toEqual("singleDay")
   })
   it("should return the string 'in'", function () {
      expect(t.k.in()).toEqual("in")
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

describe('Object helpers', function(){
   describe('the function isClockedIn', function(){
      var stateIn = {name: 'good', clockState: {'in': new Date()}}
      var stateOut = {name: 'good', clockState: {'out': new Date()}}
      it('should return true when object is clocked in', function(){
         expect(isClockedIn(stateIn)).toBe(true)
      })
      it('should return false when object is clocked out', function(){
         expect(isClockedIn(stateOut)).toBe(false)
      })
   })
})
