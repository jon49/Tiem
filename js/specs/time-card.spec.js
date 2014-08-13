// /* brackets-xunit: jasmine */
// /* brackets-xunit: includes=bower_components/lodash/dist/lodash.js,bower_components/bilby.js/bilby.js,bower_components/mithril/mithril.js,js/utilities.js,js/engine.js,js/objects.js,js/controller.js,js/events.js */
// //,ui.js
// /* global describe, it, expect, t, _, bilby */
// /*jslint asi: true*/
// /*jshint indent:3, curly:false, laxbreak:true */
// 
// 
// //describe('Core mithril extensions', function(){
// //   describe('The function parseM', function(){
// //      it('should create a mithril virtual element', function(){
// //         var el = mm.tag('#id'),
// //             cls = mm.class('color'),
// //             cls2 = mm.class('other-class'),
// //             val = mm.value('laura'),
// //             combined = zipOverObjects([el, cls, cls2, val])
// //         var m_ = mm.parse(combined)
// //         expect(combined).toEqual({ tag: '#id', class : [ 'color', 'other-class' ], value : 'laura' })
// //         expect(m_).toEqual({tag:'div', attrs:{id:'id', 'class':' color other-class'}, children:'laura'})
// //      })
// //   })
// //})
// 
// describe("Core constants", function () {
//    it("should return the string 'id'", function () {
//       expect(t.k.id()).toEqual("id")
//    })
//    it("should return the string 'in'", function () {
//       expect(t.k.in()).toEqual("in")
//    })
//    it("should return the string 'out'", function () {
//       expect(t.k.out()).toEqual("out")
//    })
//    it("should return the string 'clockState'", function () {
//       expect(t.k.state()).toEqual("clockState")
//    })
//    it("should return the string 'day'", function () {
//       expect(t.k.day()).toEqual('day')
//    })
//    it("should return the string 'jobList'", function () {
//       expect(t.k.jobList()).toEqual('jobList')
//    })
//    it("should return the string 'clockedState'", function () {
//       expect(t.k.clockedState()).toEqual('clockedState')
//    })
//    it("should return the string 'name'", function () {
//       expect(t.k.name()).toEqual('name')
//    })
//    it("should return the string 'clocked'", function () {
//       expect(t.k.comment()).toEqual('comment')
//    })
//    it("should return the string 'jobActive'", function () {
//       expect(t.k.jobActive()).toEqual('jobActive')
//    })
// })
// 
// describe('Job Setting object manipulation', function(){
//    var id = t.JobSetting.newId()
//    var newJobSetting = t.JobSetting.create(id, 'I love my job', true)
//    describe('the method newId', function(){
//       // can't be unique because it is too fast. Need to have a create multiple ids function.
//       it('should create a ~~unique~~ new id', function(){
//          expect((id > 0)).toBe(true)
//       })
//    })
//    describe('the method create', function(){
//       it('should create a new instance of Job Setting', function(){
//          var setting = toObject(newJobSetting)
//          expect(b.isOption(newJobSetting)).toBe(true)
//          expect(setting[t.k.id()]).toBe(id)
//          expect(setting[t.k.name()]).toBe('I love my job')
//          expect(setting[t.k.jobActive()]).toBe(true)
//       })
//    })
//    describe('the function update', function(){
//       it('should be able to update the job name without changing original object', function(){
//          var newO = toObject(t.JobSetting.update('New Job Name', newJobSetting))
//          expect(newO).toEqual({id:id, name:'New Job Name', jobActive: true})
//          expect(toObject(newJobSetting)).not.toEqual(newO)
//       })
//       it('should be able to update the job active status without changing the original object', function(){
//          var newO = toObject(t.JobSetting.update(false, newJobSetting))
//          expect(newO).toEqual({id:id, name:'I love my job', jobActive: false})
//          expect(toObject(newJobSetting)).not.toEqual(newO)
//       })
//    })   
// })
// 
// describe('JobSettings object manipulation and creation', function(){
// 
//    var settings = t.JobSettings.create([])
//    var s0 = t.JobSetting.create(0, 'My lovely job', true)
//    var s1 = t.JobSetting.create(1, 'My second job', true)
//    var newSettings = settings.update(s0).update(s1).update(b.none)
// 
//    describe('the function update', function(){
//       it('should add a new job setting to the job setting list, overwriting the old list', function(){
//          expect(_.isEqual(newSettings, settings)).toBe(false)
//          expect(newSettings.toArray()).toEqual([toObject(s0), toObject(s1)])
//          expect(settings.toArray()).toEqual([])
//       })
//    })
//    describe('the function get', function(){
//       it('should select the object with selected id', function(){
//          expect(toObject(newSettings.get(0))).toEqual(s0.getOrElse(void 0))
//          expect(toObject(newSettings.get(1))).toEqual(s1.getOrElse(void 0))
//       })
//    })
//    describe('the function get', function(){
//       it('should select the object with selected name', function(){
//          expect(toObject(newSettings.get('My lovely job'))).toEqual(s0.getOrElse(void 0))
//          expect(toObject(newSettings.get('My second job'))).toEqual(s1.getOrElse(void 0))
//       })
//    })
//    describe('the method valid', function(){
//       var cata = {success: f('x'), failure: f('x')}
//       it('should return cata with success as id wrapped in a singleton', function(){
//          expect(newSettings.valid(0).cata(cata)).toEqual(b.singleton('id', 0))
//       })
//       it('should return cata with success as name wrapped in a singleton', function(){
//          expect(newSettings.valid('My new job name').cata(cata)).toEqual(b.singleton('name', 'My new job name'))
//       })
//       it('should return cata with failure as a string in an array', function(){
//          expect(newSettings.valid(3).cata(cata)).toEqual(['No ID number exists'])
//       })
//       it('should return cata with failure as a string in an array', function(){
//          expect(newSettings.valid('My lovely job').cata(cata)).toEqual(['Job name already exists'])
//       })
//    })
// })
// 
// describe('Job object manipulation and creation', function(){
// 
//    var s0 = t.JobSetting.create(0, 'My lovely job', true)
//    var s1 = t.JobSetting.create(1, 'My second job', true)
//    var settings = t.JobSettings.create([toObject(s0), toObject(s1)])
//    
//    settings_ = settings.update(s0).update(s1)
// 
//    // (id, comment, singleDay, inOut, date)
//    var j0 = t.Job.create(settings, 0, '', bilby.none, t.k.out(), new Date())
//    var j1 = t.Job.create(settings, 1, 'My Comment', bilby.some(_.range(24).map(function(){return 1})), t.k.in(), new Date())
// 
//    describe('the function create', function(){
//       it('should be able to create a valid job', function(){
//          expect(get(L.id, toObject(j0))).toBe(0)
//          expect(get(L.id, toObject(j1))).toBe(1)
//          expect(t.Job.name(settings, toObject(j0))).toBe('My lovely job')
//       })
//    })
//    describe('the function update', function(){
//       it('should be able to update the comment', function(){
//          expect(toObject(t.Job.update('New comment.', j0))).toEqual(_.extend({}, toObject(j0), {comment: 'New comment.'}))
//       })
//       it('should be able to toggle clocked in/out status', function(){
//          var newDate = new Date(2014, 4, 2, 10)
//          var dateOut = new Date(2014, 4, 2, 10, 30)
//          var j0_ = b.extend(toObject(j0), {clockState: {'in': newDate}})
//          expect(toObject(t.Job.update(newDate, j0))).toEqual(j0_) // clock in
//          var singleDay_ = _.range(24).map(f('0')); singleDay_[10] = 0.5
//          var j0$ = _.extend({}, j0_, {clockState: {'out': dateOut}}, {hours: singleDay_})
//          var j0_in = t.Job.create(settings, 0, '', b.none, t.k.in(), newDate)
//          expect(toObject(t.Job.update(dateOut, j0_in))).toEqual(j0$)
//       })
//    })
// })
// 
// describe('Jobs object manipulation and creation', function(){
//    //This uses the same methods as JobSettings with only slight variation. So I won't repeat the tests.   
// })
// 
// //
// //describe('Object helpers', function(){
// //   describe('the function isClockedIn', function(){
// //      var stateIn = {name: 'good', clockState: {'in': new Date()}}
// //      var stateOut = {name: 'good', clockState: {'out': new Date()}}
// //      it('should return true when object is clocked in', function(){
// //         expect(isClockedIn(stateIn)).toBe(true)
// //      })
// //      it('should return false when object is clocked out', function(){
// //         expect(isClockedIn(stateOut)).toBe(false)
// //      })
// //   })
// //})
