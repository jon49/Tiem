/**
 * Created by jon on 2/11/14.
 */

/*jslint asi: true*/
/*jshint indent:3, curly:false, laxbreak:true */
/*global tiem, _, b */
 
/**
 **Objects**
 */

/**
 * Object constants
 */
var k = constants([['id'],
                   ['singleDay'],
                   ['in'],
                   ['out'],
                   ['state', 'clockState'],
                   ['day'],
                   ['jobList'],
                   ['clockedState'],
                   ['name'],
                   ['clocked'],
                   ['comment'],
                   ['total'],
                   ['jobActive'],
                   ['jobs'],
                   ['jobPlaceHolder', 'Add Job']
])

tiem = tiem.property('k', k)

// **Validate objects**

var Jobs = function(){
   this.list = []
   this.current = b.none
}
var JobSettings = function(){
   this.list = []
   this.current = b.none
}

// #Object Definitions
// {jobID: 0, name: 'name', jobActive: true|false}
var JobSetting = b.tagged('JobSetting', [k.id(), k.name(), k.jobActive()])
//var jobSetting = _.curry(JobSetting)
// {jobID: 0, name: 'name', comment: '', singleDay: [0..23].map(0), total: 0, clockState: {out|in: ''}}
var ClockedIn = b.tagged('ClockedIn', [k.in()])
var ClockedOut = b.tagged('ClockedOut', [k.out()])
//var JobSkeleton = b.tagged('JobSkeleton', [k.id(), k.comment(), k.singleDay(), k.state()])
//var jobSkeleton = _.curry(JobSkeleton)
var Job = b.tagged('Job', [k.id(), k.name(), k.comment(), k.singleDay(), k.total(), k.state()])
//var job = _.curry(Job)
var Objects = b.tagged('Objects', ['Jobs', 'JobSettings'])
   
//var CurrentJob = b.tagged('CurrentJob', ['jobList', 'currentJob'])
//var currentJob = _.curry(CurrentJob)
   
   // Validation
//var validId = function (id) {
//      return tiem.isWholeNumber(id) ? b.success(id) : b.failure(['ID must be a whole number'])
//   }
//   
//var validJobName = function (name) {
//   var name_ = String(name).trim()
//      return _.isEmpty(name_) ? b.failure(['Name must not be empty']) : b.success(name_)
//   }
//   
//var validJobActive = function (activeJob) {
//      return _.isBoolean(activeJob) ? b.success(activeJob) : b.failure(['Active job must be of type Boolean'])
//   }
//   
//var validSingleDay = function (singleDay) {
//   var countNot24 = function (dayArray) {
//         return !_.isEqual(dayArray.length, 24)
//      }
//   var areNumbers = _.compose(_.all, _.partialRight(_.map, _.isNumber))
//   var isBetweenAbs1 = _.partial(tiem.isBetween, -1, 1)
//   var allBetweenAbs1 = _.compose(_.all, _.partialRight(_.map, isBetweenAbs1))
//
//      return   !_.isArray(singleDay) 
//                  ? b.failure(['Single day must be an array']) 
//               : countNot24(singleDay) 
//                  ? b.failure(['Single day must have array size of twenty-four']) 
//               : !areNumbers(singleDay) 
//                  ? b.failure(['Single day must only have numbers in array']) 
//               : !allBetweenAbs1(singleDay) 
//                  ? b.failure(['Single day must only have numbers between -1 and 1']) 
//               : b.success(singleDay)
//   }
   
//var validDate = function(date){
//   var date_ = _.isString(date) ? Date.parse(date) : date
//      return _.isDate(date_) ? b.success(date_) : b.failure(['Is not a date'])
//   }
//var validInOut = function(inOut){
//      return (_.isEqual(inOut, k.in()) || _.isEqual(inOut, k.out())) ? b.success(inOut) : b.failure(["Clock state must be 'in' or 'out'"])
//   }
//   
//var validComment = function(comment){
//      return String(comment).trim()
//   }
//   
//var createSingleDay = function(){return _.range(24).map(function(){return 0})}
   
var getJobById = function(id){
   var id_ = _.zipObject([k.id()], [id])
   var current = _.find(this.list, id_)
   this.current = _.isEmpty(current) ? b.none : b.some(current)
   return this
}

var addCurrentJob = function(theseJobs){
   var job = theseJobs.current.getOrElse({})
   theseJobs.list = _.reject(theseJobs.list, function(item){
      return _.isEqual(item.id, job.id)
   }).concat(job)
   return theseJobs
}
   
var addJob = function(){ 
   var job = _.first(arguments),
      ow = _.last(arguments),
      overwrite = _.isBoolean(ow) ? ow : false
   if (_.contains(this.list, job[k.id()]) && !overwrite){
      this.current = b.none
      return this
   }
   this.current = b.some(job)
   return addCurrentJob(this)
}

var validJobId = function(list, id){
   var id_ = parseInt(id)
   return isNaN(id_)
      ? b.failure(['ID is not a number'])
      : !_.any(list, _.zipObject([k.id()], [id_]))
      ? b.failure(['No ID number exists'])
      : b.success(id_)
}

var validJobName = function(list, name){
   var name_ = name.trim()
   return _.isEmpty(name_)
      ? b.failure(['Job name must contain characters'])
      : _.any(list, _.zipObject([k.name()], [name_]))
      ? b.failure(['Job name already exists'])
      : b.success(name_)
}

var validateSingle = function(type, validation, success, failure){
   var 
      type_ = b.curry(b.tagged(type.replace(/^(.){1}/,'$1'.toUpperCase()), [type])),
      result = b.Do()(b.Do()(validation < type_))
   result.cata({
      success: success,
      failure: failure
   })
}

var validJobName_ = function(name){
   var that = this, v
   validateSingle(k.name(),
                  validJobName(that.list, name), 
                  function(value){
                     that.current = b.none
                     v = b.success(value.name)
                  },
                  function(errors){
                     that.current = b.none
                     v = b.failure(errors)
                  })
   return b.Do()(v)
}

var validJobSelection = function(object){
   var that = this, v
   validateSingle(k.id(),
                  validJobId(that.list, object), 
                  function(value){
                     getJobById.apply(that, [value.id])
                     v = b.success(that.current.getOrElse(''))
                  },
                  function(errors){
                     that.current = b.none 
                     v = b.failure(errors)
                  })
   return b.Do()(v)
}

var change = _.curry(function(property, value){
   if (this.current.isSome){
      var job = this.current.getOrElse({})
      job[property] = value
      this.current = b.some(job)
      return addCurrentJob(this)
   }
})

   
//Determine if the job is clocked in or out.
var isClockedIn = function (job) {
    return _.has(job[k.state()], k.in())
}

//Change job state to clocked in.
var clockIn = function (job, date) {
   job[k.state()] = ClockedIn(date)
   return job
}

//Job is clocked in. Clock it out and update number of hours worked.
var clockOut = function (job, date) {
    var start = fractionalHours(job[k.state()][k.in()])
    var end = fractionalHours(date)
    var newSingleDay = addRollingArray(job[k.singleDay()], start, end, 1)
    job[k.state()] = ClockedOut(date)
    job[k.singleDay()] = newSingleDay
    job[k.total()] = sum(newSingleDay)
    return job
}

var updateDate = function(date){
   //Toggle clock
   var job = this.current.getOrElse({})
   this.current = b.some((isClockedIn(job)) ? clockOut(job, date) : clockIn(job, date))
   return addCurrentJob(this)
}

//id, comment, singleDay, inOut, date
//k.id(), k.name(), k.comment(), k.singleDay(), k.total(), ClockState
var createJob = function(jobSettings, id, comment, singleDay, inOut, date){
   var jobSetting = _.find(jobSettings.list, function(setting){
      return _.isEqual(setting[k.id()], id)
   })
   if (_.isEmpty(jobSetting))
      return b.error('A new job must be created in the job settings first!')
   var singleDay_ = singleDay.getOrElse(_.range(24).map(function(){return 0}))
   var inOut_ = _.isEqual(inOut, k.out()) ? ClockedOut(date) : ClockedIn(date)
   return Job(id, jobSetting[k.name()], comment, singleDay_, sum(singleDay_), inOut_)
}

var toArray = function(){return this.list}

var toObject = function(){return this.current}
   
tiem = 
   tiem.property(
   'JobSettings',
   b.environment() 
      .property(
         'new',
         function(){return new JobSettings()}
      )
      .property(
         'toArray',
         toArray
      )
      .property(
         'toObject',
         toObject
      )
      .method(
         'create',
         function(id, name, active){
            return isWholeNumber(id) && _.isString(name) && _.isBoolean(active)
         },
         JobSetting
      )
      .method(
         'add',
         b.isInstanceOf(JobSetting),
         addJob
      )
      .method(
         'id',
         isWholeNumber,
         getJobById
      )
      .property(
         'newId',
         function(){return (new Date()).getTime()}
      )
      .method(
         'update',
         _.isString,
         change(k.name())
      )
      .method(
         'update',
         _.isBoolean,
         change(k.jobActive())
      )
      .method(
         'name',
         _.isString,
         function(name){
            this.current = _.first(_.filter(this.list, function(setting){
               return _.isEqual(setting[k.name()], name)
            }))
            return this
         }
      )
      .method(
         'validSelection',
         function(v){return _.isString(v) || _.isNumber(v)},
         validJobSelection
      ) 
      .method(
         'validName',
         _.isString,
         validJobName_
      )
)
   
tiem = 
   tiem.property(
   'Jobs',
   b.environment()
      .property(
         'new',
         function(){return new Jobs()}
      )
      .property(
         'toArray',
         toArray
      )
      .property(
         'toObject',
         toObject
      )
      .method(
         'create',
         function(jobSettings, id, comment, singleDay, inOut, date){
            return isWholeNumber(id)
               && _.isString(comment)
               && (b.isOption(singleDay) && singleDay.fold(function(a){return _.isArray(a) && a.length === 24}, function(){return true}))
               && (_.isEqual(inOut, k.in()) || _.isEqual(inOut, k.out()))
               && _.isDate(date)
               && b.isInstanceOf(JobSettings, jobSettings)
         },
         createJob
      )
      .method(
         'add',
         b.isInstanceOf(Job),
         addJob
      )
      .method(
         'id',
         isWholeNumber,
         getJobById
      )
      .method(
         'update',
         _.isString,
         change(k.comment())
      )
      .method(
         'update',
         _.isDate,
         updateDate
      )
)
      

var extendObject = function(object, extensions){
      _(extensions).forIn(function(value, key){
         object.prototype[key] = value 
      })
}

extendObject(JobSettings, tiem.JobSettings)
extendObject(Jobs, tiem.Jobs)

   

// /**
//  * Determine if job ids are unique in list of objects.
//  */
// tiem.O.areUniqueIds = tiem.areUniqueValues(k.id())
// /**
//  * Determine if job names are unique in list of objects.
//  */
// tiem.O.areUniqueNames = tiem.areUniqueValues(k.name())
// 
// /**
//  * Validate Job ID
//  * @param {Number} id Whole number unique to Job object.
//  * @return {Number} if valid same number
//  * @throws {Error} Job ID: must be a whole number.
//  */
// tiem.O.validateJobId = function (id) {
//    return tiem.Constraints.conditions(['Job ID: must be a whole number', tiem.isWholeNumber])(id)
// }
// 
// /**
//  * Validate Job Name
//  * @param {String} name Job name with length greater than zero.
//  * @return {String} if valid Job name
//  * @throws {Error} Job Name: must be string
//  * @throws {Error} Job Name: value must have a length greater zero
//  */
// tiem.O.validateJobName = function (name) {
//    var isNotEmpty = tiem.complement(_.isEmpty)
//    return tiem.Constraints.conditions(
//        ['Job Name: must be string', _.isString], ['Job Name: must have a length greater zero', isNotEmpty]
//    )(name)
// }
// 
// /**
//  * Validate Active Job
//  * @param {Boolean} active Represents if a job is considered active or inactive.
//  * @return {Boolean} if valid boolean
//  * @throws {Error} Job Active: value must be a boolean
//  */
// tiem.O.validateActiveJob = function (active) {
//    return tiem.Constraints.conditions(['Job Active: value must be a boolean', _.isBoolean])(active)
// }
// /**
//  * Validate Single Day object
//  * @param {Array<Number>} singleDay Rate of each of a day worked.
//  * @return {Array<Number>} if valid array
//  * @throws {Error} Single Day: Must be array of size 24
//  * @throws {Error} Single Day: Must be all numbers
//  * @throws {Error} Single Day: Value must be between -1 and 1
//  */
// tiem.O.validateSingleDay = function (singleDay) {
// 
//    //Validate single day.
//    var count24 = function (dayArray) {
//       return dayArray.length === 24
//    }
//    var areNumbers = _.compose(_.all, _.partialRight(_.map, _.isNumber))
//    var isBetweenAbs1 = _.partial(tiem.isBetween, -1, 1)
//    var allBetweenAbs1 = _.compose(_.all, _.partialRight(_.map, isBetweenAbs1))
// 
//    return tiem.Constraints.conditions(
//        ['Single Day: Must be array of size 24', count24], ['Single Day: Must be all numbers', areNumbers], ['Single Day: Value must be between -1 and 1', allBetweenAbs1])(singleDay)
// 
// }
// /**
//  * Validate date object
//  * @param {Date} date Date object
//  * @return {Date} if valid date
//  * @throws {Error} In: Must have valid date
//  */
// tiem.O.validateDate = function (date) {
//    //Validate In
//    return tiem.Constraints.conditions(['In: Must have valid date', _.isDate])(date)
// }
// /**
//  * Validate clock state
//  * @param {in|out} inOut in/out object
//  * @return {in|out} if valid in/out object
//  * @throws {Error} Clock State: Must be an object type In or Out
//  */
// tiem.O.validateClockState = function (inOut) {
//    //Validate input
//    var isInOrOut = function (inOut) {
//       return _.has(inOut, k. in ()) || _.has(inOut, k.out())
//    }
//    return tiem.Constraints.conditions(['Clock State: Must be an object type In or Out', isInOrOut])(inOut)
// }
// /**
//  * Validate clock information
//  * @param {Array<Object>} clockInfo Array containing objects singleDay and clock state
//  * @return {Array<Object>} if valid array object
//  * @throws {Error} Clock Info: Must be an object of Clock State and Single Day
//  */
// tiem.O.validateClockInfo = function (clockInfo) {
//    //Validate input
//    var containsClockInfoObjects = function ( /* [singleDay, state]) */ ) {
//       var args = tiem.toFlatArray(arguments)
//       var singleDay = _.first(args),
//          total = args[1],
//          state = _.last(args);
//       return tiem.have([
//             [singleDay, k.singleDay()],
//             [state, k.state()],
//             [total, k.total()]
//          ])
//    }
//    return tiem.Constraints.conditions(
//         ['Clock Info: Must be an object of Clock State, Total, and Single Day', containsClockInfoObjects])(clockInfo)
// }
// /**
//  * Validate job information object
//  * @param {Array<Object>} jobInfo Array containing objects {single day, clock state}, and job
//  * @return {Array<Object>} if valid array object
//  * @throws {Error} Job Info: Must have objects Clock Info and Job
//  */
// tiem.O.validateJobInfo = function (jobInfo) {
//    //Validate input
//    var containsJobInfo = function ( /* [{single day, clock state}, job id, job name, comment] */ ) {
//       var args = tiem.toFlatArray(arguments)
//       var clockInfo = _.first(args),
//          id = args[1],
//          name = args[2],
//          comment = _.last(args);
//       return (tiem.have([
//             [clockInfo, k.singleDay()],
//             [clockInfo, k.state()],
//             [id, k.id()],
//             [name, k.name()],
//             [comment, k.comment()]
//         ]))
//    }
//    return tiem.Constraints.conditions(
//   ['Job Info: Must have objects Clock Info, Job ID/Name, and comment', containsJobInfo])(jobInfo)
// }
// 
// /**
//  * Validate Day object
//  * @param {Array<Object>} dayArray Object containing the day's date and list of job info objects
//  * @return {Array<Object>} if valid object
//  * @throws {Error} Day: Must have unique IDs
//  * @throws {Error} Day: Must have date and job list
//  */
// tiem.O.validateDay = function (dayArray) {
//    //Validate Jobs
// 
//    var areUniqueIdsLast = _.compose(tiem.O.areUniqueIds, _.last)
// 
//    var containsDayArray = function ( /* [date, [jobInfo]]*/ ) {
//       var args = _.toArray(arguments)[0]
//       var date = _.first(args),
//          jobInfo = _.last(args);
//       return _.isDate(date) && _.isArray(jobInfo)
//    }
// 
//    return tiem.Constraints.conditions(
//       ['Day: Must have unique IDs', areUniqueIdsLast], ['Day: Must have date and job list', containsDayArray]
//    )(dayArray)
// }
// 
// tiem.Settings.createJobList = tiem.O.validateJobList = function (jobArray) {
//    return tiem.Constraints.conditions(
//         ['Jobs must have unique IDs', tiem.O.areUniqueIds], ['Jobs must have unique names', tiem.O.areUniqueNames]
//    )(jobArray)
// }
// 
// /**
//  * tiem.O objects
//  * @example tiem.O.createJobId(0) -> {id: 0}
//  * @param {Number} Whole number representing job object ID.
//  * @return {Object} Object of type {id: 0}
//  * @throws {Error} Job ID: must be a whole number
//  */
// tiem.Settings.createJobId = tiem.O.createJobId = function (id) {
//    tiem.O.validateJobId(id)
// 
//    return _.zipObject(
//   [k.id()], [id]
//    )
// }
// 
// /**
//  * Create a name for job.
//  * @example tiem.O.createJobName(' a job name  ') => {name: 'a job name'}
//  * @param {String} name The job name for current instance. Must be string with less than 50 characters.
//  * @returns {Object} {name: <String>}
//  */
// tiem.O.createJobName = tiem.Settings.createJobName = function (name) {
//    var name_ = String(name.trim())
//    tiem.O.validateJobName(name_)
//    return _.zipObject(
//   [k.name()], [name_]
//    )
// }
// 
// /**
//  * Create a comment.
//  * @example tiem.O.createComment(' a comment, yay!  ') => {comment: 'a comment, yay!'}
//  * @param {String} comment The job comment for current instance. Must be a string.
//  * @returns {Object} {comment: <String>}
//  */
// tiem.O.createComment = function (comment) {
//    var comment_ = _.isEmpty(comment) ? '' : String(comment.trim())
//    return _.zipObject(
//   [k.comment()], [comment_]
//    )
// }
// 
// /**
//  * Object which represents a single day's time.
//  * @example tiem.O.createSingleDay([0..23]) -> {singleDay: [0..23]}
//  * @param {Array<Number>} dayArray Array of length 24 with values between -1 and 1 inclusive, a zero length array is acceptable
//  * @return {Object} {singleDay: [0..23]}
//  * @throws {Error} Single Day: Must be array of size 24
//  * @throws {Error} Single Day: Must be all numbers
//  * @throws {Error} Single Day: Value must be between -1 and 1
//  */
// tiem.O.createSingleDay = function (dayArray) {
// 
//    'use strict';
// 
//    var dayArray_ = (_.isEmpty(dayArray)) ?
//       _.range(24).map(function () {
//          return 0
//       }) :
//       _.clone(dayArray)
// 
//    // Determine the validity of the argument.
//    tiem.O.validateSingleDay(dayArray_)
// 
//    return _.zipObject(
//     [k.singleDay()], [dayArray_]
//    )
// 
// }
// 
// /**
//  * Creates an object wrapped around the total.
//  * @example tiem.O.createTotal({singleDay: [0..23].map(1)}) => {total: 24}
//  * @param {Object<singleDay>} singleDay Object single day.
//  * @returns {Object<total>} Total object with number total.
//  */
// tiem.O.createTotal = function (singleDay) {
//    return _.zipObject(
//         [k.total()], [tiem.sum(singleDay[k.singleDay()])])
// }
// 
// /*
//  * Object representing the clocked in state.
//  * @example tiem.O.createIn(new Date()) -> {in: <date value>}
//  * @param {Date} date Date/Time when clocked in
//  * @return {Object} {in: <date value>}
//  * @throws {Error} In: Must have valid date
//  */
// tiem.O.createIn = function (date) {
//    'use strict';
// 
//    //Determine the validity of the argument.
//    tiem.O.validateDate(date)
// 
//    return _.zipObject(
//     [k. in ()], [date]
//    )
// }
// /*
//  * Object representing clocked out state.
//  * @example tiem.O.createOut() -> {out: ''}
//  * @return {Object} {out: ''}
//  */
// tiem.O.createOut = function () {
//    'use strict';
// 
//    return _.zipObject(
//     [k.out()], ['']
//    )
// 
// }
// /*
//  * Object which represents the toggle state of the job.
//  * @example tiem.O.createClockState({in:date}|{out:''}) -> {clockState: {<in|out>}}
//  * @param {Object<in>|Object<out>} inOut In or out object.
//  * @return {Object<in>|Object<out>} {clockState: {<in|out>}}
//  * @throws {Error} In: Must have valid date
//  */
// tiem.O.createClockState = function (inOut) {
//    "use strict";
// 
//    tiem.O.validateClockState(inOut)
// 
//    return _.zipObject(
//     [k.state()], [inOut]
//    )
// 
// }
// /*
//  * Contains objects ClockState and SingleDay.
//  * @example tiem.O.createClockInfo({singleDay: [0..23]}, {clockState:{in|out:<value>}})
//  * @param {Object<singleDay>} singleDay Object singleDay with array value representing hours over 24 hour period.
//  * @param {Object<total>} total Object total containing the sum of single day object.
//  * @param {Object<in>|Object<out>} inOut In or out object.
//  * @return {Object} {singleDay: [0..23], total: <Number>, clockState: {<in|out>}}
//  * @throws {Error} Clock Info: Must be an object of Clock State and Single Day
//  */
// tiem.O.createClockInfo = function (singleDay, total, state) {
//    "use strict";
// 
//    tiem.O.validateClockInfo([singleDay, total, state])
// 
//    return _.assign(singleDay, total, state)
// 
// }
// /*
//  * Contains objects ClockInfo and Job
//  * @example tiem.O.createJobInfo({singleDay:<[0..23]>, in|out:<value>}, {id:<wholeNumber>}) -> {jobID:<wholeNumer>, singleDay:<[0..23]>, in|out:<value>}
//  * @param {Object} clockInfo Object containing singleDay and in|out objects.
//  * @param {Object<id>} id Object containing the unique job ID.
//  * @param {Object<name>} name Object containing the unique job name.
//  * @param {Object<comment>} comment Object containing comment.
//  * @return {Object} {id: <value>, singleDay: [0..23], clockState: {<in|out>}}
//  * @throws {Error} Job Info: Must have objects Clock Info and Job
//  */
// tiem.O.createJobInfo = function (clockInfo, id, name, comment) {
//    "use strict";
// 
//    tiem.O.validateJobInfo([clockInfo, id, name, comment])
// 
//    return _.assign(id, name, comment, clockInfo)
// 
// }
// /*
//  * Contains a list of JobInfo objects.
//  * @example tiem.O.createJobs([jobInfo]) -> {jobID:<wholeNumber>, singleDay:<[0..23]>, in|out:<value>}
//  * @param {Date} date The date of the list of Job information objects.
//  * @param {Array<jobInfo>} jobInfos Array containing jobInfos.
//  * @return {Object} {date: <value>, [jobInfo{}]}
//  * @throws {Error} Day: Must have date and job list
//  * @throws {Error} Day: Must have unique IDs
//  */
// tiem.O.createDay = function (date, jobInfos) {
//    "use strict";
// 
//    tiem.O.validateDay([date, jobInfos])
// 
//    return _.zipObject([k.day(), k.jobList()], [date, jobInfos])
// }
// 
// /**
//  * Create the object 'clock state' which is clocked in.
//  * @example createClockedInState(new Date()) -> {clockState: {in: <Date>}}
//  * @param {Date} time The time when the person clocks in.
//  * @return {Object<clockState>} {clockState: {in: <Date>}}
//  */
// tiem.O.inState = _.compose(tiem.O.createClockState, tiem.O.createIn)
// 
// /**
//  * The object 'clock state' which is clocked out.
//  * @example clockedOutState -> {clockState: {out: ''}}
//  */
// tiem.O.outState = _.compose(tiem.O.createClockState, tiem.O.createOut)
// 
// /**
//  * The object 'clock information' which is clocked out.
//  * @example tiem.O.defaultClockInfo() -> {singleDay: [0..23].map(0), 0, clockState: {out: ''}}
//  */
// tiem.O.defaultClockInfo = function () {
//    var singleDay = tiem.O.createSingleDay('')
//    return tiem.O.createClockInfo(singleDay, tiem.O.createTotal(singleDay), tiem.O.outState())
// }
// 
// /*
//  * Converts the JobInfo object to a view compatible object.
//  * @example tiem.O.defaultJobInfo() => {jobID: 0, name: 'name', comment: '', singleDay: [0..23].map(0), total: 0, clockState: {out: ''}}
//  * @returns Default object containing job information. {jobID: 0, name: 'name', comment: '', singleDay: [0..23].map(0), total: 0, clockState: {out: ''}}
//  */
// tiem.O.defaultJobInfo = function () {
// 
//    var clockInfo = tiem.O.defaultClockInfo()
//    return tiem.O.createJobInfo(
//       clockInfo,
//       tiem.O.createJobId(0),
//       tiem.O.createJobName(k.name()),
//       tiem.O.createComment(''))
// 
// }
// 
// /*****************************
//  * Settings
//  *****************************/
// 
// tiem.Settings.createJobActive = function (active) {
//    tiem.O.validateActiveJob(active)
//    return _.zipObject(
//         [k.jobActive()], [active])
// }
// 
// tiem.Settings.jobs = function () {
//    // Need to get this data from where it is stored.
// 
//    return [_.assign(tiem.Settings.createJobActive(true), tiem.Settings.createJobId(0), tiem.Settings.createJobName('Job1')),
//       _.assign(tiem.Settings.createJobActive(true), tiem.Settings.createJobId(1), tiem.Settings.createJobName('Job2')),
//       _.assign(tiem.Settings.createJobActive(false), tiem.Settings.createJobId(2), tiem.Settings.createJobName('Not a Job'))
//       ]
// }
