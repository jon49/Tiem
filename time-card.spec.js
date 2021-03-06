/* brackets-xunit: jasmine */
/* brackets-xunit: includes=bower_components/lodash/dist/lodash.js,bower_components/bilby.js/bilby.js,bower_components/mithril/mithril.js,js/utilities.js,js/engine.js,js/objects.js,js/controller.js,js/events.js */
//,ui.js
/* global describe, it, expect, t, _, bilby */
/*jslint asi: true*/
/*jshint indent:3, curly:false, laxbreak:true */

describe("How the utilities are used in project", function () {
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

      expect(t.areUniqueNow('dogName', uniqueObject)).toBe(true)
      expect(t.areUniqueNow('dogName', uniqueObjects)).toBe(true)
      expect(t.areUniqueNow('dogName', notUniqueObjects)).not.toBe(true)
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
   describe("The function areUnique", function () {
      it("should return a function which evaluates an array of objects given a certain key - true when all unique", function () {
         expect(t.areUnique('myKey')([{
            myKey: 1
         }, {
            myKey: 2
         }])).toBe(true)
      })
      it("should return a function which evaluates an array of objects given a certain key - false when not unique", function () {
         expect(t.areUnique('myKey')([{
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
   describe('The function not', function(){
      it('should return false when given true', function(){
         expect(t.not(true)).toBe(false)
      })
      it('should return true when given false', function(){
         expect(t.not(false)).toBe(true)
      })
   })
   describe('The function hasDeep', function(){
      var o = {otheKey: 'my', state: {in: 'some data'}}
      it('should return true when layered object has key', function(){
         expect(t.hasDeep('in')(o)).toBe(true)
      })
      it('should return false when layered object does not have the key', function(){
         expect(t.hasDeep('out')(o)).toBe(false)
      })
      it('should not disturb the original object', function(){
         expect(o).toEqual({otheKey: 'my', state: {in: 'some data'}})
      })
   })
   describe('The function invoke', function(){
      it('should invoke a method with a single argument', function(){
         expect(t.invoke('toLowerCase')('HELLO')).toEqual('hello')
         expect(t.invoke('toLowerCase')('HELLO')).not.toEqual('Hello')
      })
   })
   describe('The function isArrayOf', function(){
      var O = b.tagged('O', ['o'])
      var F = b.tagged('F', ['f'])
      var aO = [O('hi'), O('bye')]
      it('should return true when array contains only what predicate describes as true', function(){
         expect(t.isArrayOf(b.isInstanceOf(O))(aO)).toBe(true)
      })
      it('should return false when array contains falsy object that predicate describes as false', function(){
         expect(t.isArrayOf(b.isInstanceOf(O))(aO.concat(F('doh!')))).toBe(false)
      })
   })
   describe('The function isOptionOf', function(){
      
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

describe('Job Setting object manipulation', function(){
   var id = t.JobSetting.newId()
   var newJobSetting = t.JobSetting.create(id, 'I love my job', true)
   describe('the method newId', function(){
      // can't be unique because it is too fast. Need to have a create multiple ids function.
      it('should create a ~~unique~~ new id', function(){
         expect((id > 0)).toBe(true)
      })
   })
   describe('the method create', function(){
      it('should create a new instance of Job Setting', function(){
         var setting = toObject(newJobSetting)
         expect(b.isOption(newJobSetting)).toBe(true)
         expect(setting[t.k.id()]).toBe(id)
         expect(setting[t.k.name()]).toBe('I love my job')
         expect(setting[t.k.jobActive()]).toBe(true)
      })
   })
   describe('the function update', function(){
      it('should be able to update the job name without changing original object', function(){
         var newO = toObject(t.JobSetting.update('New Job Name', newJobSetting))
         expect(newO).toEqual({id:id, name:'New Job Name', jobActive: true})
         expect(toObject(newJobSetting)).not.toEqual(newO)
      })
      it('should be able to update the job active status without changing the original object', function(){
         var newO = toObject(t.JobSetting.update(false, newJobSetting))
         expect(newO).toEqual({id:id, name:'I love my job', jobActive: false})
         expect(toObject(newJobSetting)).not.toEqual(newO)
      })
   })   
})

describe('JobSettings object manipulation and creation', function(){

   var settings = t.JobSettings.create([])
   var s0 = t.JobSetting.create(0, 'My lovely job', true)
   var s1 = t.JobSetting.create(1, 'My second job', true)
   var newSettings = settings.update(s0).update(s1).update(b.none)

   describe('the function update', function(){
      it('should add a new job setting to the job setting list, overwriting the old list', function(){
         expect(_.isEqual(newSettings, settings)).toBe(false)
         expect(newSettings.toArray()).toEqual([toObject(s0), toObject(s1)])
         expect(settings.toArray()).toEqual([])
      })
   })
   describe('the function get', function(){
      it('should select the object with selected id', function(){
         expect(toObject(newSettings.get(0))).toEqual(s0.getOrElse(void 0))
         expect(toObject(newSettings.get(1))).toEqual(s1.getOrElse(void 0))
      })
   })
   describe('the function get', function(){
      it('should select the object with selected name', function(){
         expect(toObject(newSettings.get('My lovely job'))).toEqual(s0.getOrElse(void 0))
         expect(toObject(newSettings.get('My second job'))).toEqual(s1.getOrElse(void 0))
      })
   })
   describe('the method valid', function(){
      var cata = {success: f('x'), failure: f('x')}
      it('should return cata with success as id wrapped in a singleton', function(){
         expect(newSettings.valid(0).cata(cata)).toEqual(b.singleton('id', 0))
      })
      it('should return cata with success as name wrapped in a singleton', function(){
         expect(newSettings.valid('My new job name').cata(cata)).toEqual(b.singleton('name', 'My new job name'))
      })
      it('should return cata with failure as a string in an array', function(){
         expect(newSettings.valid(3).cata(cata)).toEqual(['No ID number exists'])
      })
      it('should return cata with failure as a string in an array', function(){
         expect(newSettings.valid('My lovely job').cata(cata)).toEqual(['Job name already exists'])
      })
   })
})

describe('Job object manipulation and creation', function(){

   var s0 = t.JobSetting.create(0, 'My lovely job', true)
   var s1 = t.JobSetting.create(1, 'My second job', true)
   var settings = t.JobSettings.create([toObject(s0), toObject(s1)])
   
   settings_ = settings.update(s0).update(s1)

   // (id, comment, singleDay, inOut, date)
   var j0 = t.Job.create(settings, 0, '', bilby.none, t.k.out(), new Date())
   var j1 = t.Job.create(settings, 1, 'My Comment', bilby.some(_.range(24).map(function(){return 1})), t.k.in(), new Date())

   describe('the function create', function(){
      it('should be able to create a valid job', function(){
         expect(get(L.id, toObject(j0))).toBe(0)
         expect(get(L.id, toObject(j1))).toBe(1)
         expect(t.Job.name(settings, toObject(j0))).toBe('My lovely job')
      })
   })
   describe('the function update', function(){
      it('should be able to update the comment', function(){
         expect(toObject(t.Job.update('New comment.', j0))).toEqual(_.extend({}, toObject(j0), {comment: 'New comment.'}))
      })
      it('should be able to toggle clocked in/out status', function(){
         var newDate = new Date(2014, 4, 2, 10)
         var dateOut = new Date(2014, 4, 2, 10, 30)
         var j0_ = b.extend(toObject(j0), {clockState: {'in': newDate}})
         expect(toObject(t.Job.update(newDate, j0))).toEqual(j0_) // clock in
         var singleDay_ = _.range(24).map(f('0')); singleDay_[10] = 0.5
         var j0$ = _.extend({}, j0_, {clockState: {'out': dateOut}}, {hours: singleDay_})
         var j0_in = t.Job.create(settings, 0, '', b.none, t.k.in(), newDate)
         expect(toObject(t.Job.update(dateOut, j0_in))).toEqual(j0$)
      })
   })
})

describe('Jobs object manipulation and creation', function(){
   //This uses the same methods as JobSettings with only slight variation. So I won't repeat the tests.   
})

//
//describe('Object helpers', function(){
//   describe('the function isClockedIn', function(){
//      var stateIn = {name: 'good', clockState: {'in': new Date()}}
//      var stateOut = {name: 'good', clockState: {'out': new Date()}}
//      it('should return true when object is clocked in', function(){
//         expect(isClockedIn(stateIn)).toBe(true)
//      })
//      it('should return false when object is clocked out', function(){
//         expect(isClockedIn(stateOut)).toBe(false)
//      })
//   })
//})
