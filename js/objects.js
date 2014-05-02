/**
 * Created by jon on 2/11/14.
 */

/*jslint asi: true*/
/*jshint indent:3, curly:false, laxbreak:true */
/*global Tiem, _, bilby */

/**
 **Objects**
 */

/**
 * Object constants
 */
Tiem.k = Tiem.constants([['jobId'],
                     ['singleDay'],
                     ['in'],
                     ['out'],
                     ['state', 'clockState'],
                     ['day'],
                     ['jobList'],
                     ['clockedState'],
                     ['jobName'],
                     ['clocked'],
                     ['comment'],
                     ['total'],
                     ['jobActive'],
                     ['jobs'],
                     ['jobPlaceHolder', 'Add Job']
                       ])

// **Validate objects**

Tiem.O = function () {

   var Jobs = function(){
      this.list = []
      this.current = undefined
   }
   var JobSettings = function(){
      this.list = []
      this.current = undefined
   }
   
   // #Object Definitions
   // {jobID: 0, jobName: 'jobName', jobActive: true|false}
   var JobSetting = bilby.tagged('JobSetting', [Tiem.k.jobId(), Tiem.k.jobName(), Tiem.k.jobActive()])
//   var jobSetting = _.curry(JobSetting)
   // {jobID: 0, jobName: 'jobName', comment: '', singleDay: [0..23].map(0), total: 0, clockState: {out|in: ''}}
   var ClockedIn = bilby.tagged('ClockedIn', [Tiem.k.in()])
   var ClockedOut = bilby.tagged('ClockedOut', [Tiem.k.out()])
//   var JobSkeleton = bilby.tagged('JobSkeleton', [Tiem.k.jobId(), Tiem.k.comment(), Tiem.k.singleDay(), Tiem.k.state()])
//   var jobSkeleton = _.curry(JobSkeleton)
   var Job = bilby.tagged('Job', [Tiem.k.jobId(), Tiem.k.jobName(), Tiem.k.comment(), Tiem.k.singleDay(), Tiem.k.total(), Tiem.k.state()])
//   var job = _.curry(Job)
   var Objects = bilby.tagged('Objects', ['Jobs', 'JobSettings'])
   
//   var CurrentJob = bilby.tagged('CurrentJob', ['jobList', 'currentJob'])
//   var currentJob = _.curry(CurrentJob)
   
   // Validation
//   var validId = function (id) {
//      return Tiem.isWholeNumber(id) ? bilby.success(id) : bilby.failure(['ID must be a whole number'])
//   }
//   
//   var validJobName = function (name) {
//      var name_ = String(name).trim()
//      return _.isEmpty(name_) ? bilby.failure(['Name must not be empty']) : bilby.success(name_)
//   }
//   
//   var validJobActive = function (activeJob) {
//      return _.isBoolean(activeJob) ? bilby.success(activeJob) : bilby.failure(['Active job must be of type Boolean'])
//   }
//   
//   var validSingleDay = function (singleDay) {
//      var countNot24 = function (dayArray) {
//         return !_.isEqual(dayArray.length, 24)
//      }
//      var areNumbers = _.compose(_.all, _.partialRight(_.map, _.isNumber))
//      var isBetweenAbs1 = _.partial(Tiem.isBetween, -1, 1)
//      var allBetweenAbs1 = _.compose(_.all, _.partialRight(_.map, isBetweenAbs1))
//
//      return   !_.isArray(singleDay) 
//                  ? bilby.failure(['Single day must be an array']) 
//               : countNot24(singleDay) 
//                  ? bilby.failure(['Single day must have array size of twenty-four']) 
//               : !areNumbers(singleDay) 
//                  ? bilby.failure(['Single day must only have numbers in array']) 
//               : !allBetweenAbs1(singleDay) 
//                  ? bilby.failure(['Single day must only have numbers between -1 and 1']) 
//               : bilby.success(singleDay)
//   }
   
//   var validDate = function(date){
//      var date_ = _.isString(date) ? Date.parse(date) : date
//      return _.isDate(date_) ? bilby.success(date_) : bilby.failure(['Is not a date'])
//   }
//   var validInOut = function(inOut){
//      return (_.isEqual(inOut, Tiem.k.in()) || _.isEqual(inOut, Tiem.k.out())) ? bilby.success(inOut) : bilby.failure(["Clock state must be 'in' or 'out'"])
//   }
//   
//   var validComment = function(comment){
//      return String(comment).trim()
//   }
//   
//   var createSingleDay = function(){return _.range(24).map(function(){return 0})}
   
//   var newJobSetting = function(id, name, active){
//      var id_ = bilby.isNone(id) ? validId((new Date()).getTime) : validId(id),
//          name_ = bilby.isNone(name) ? validJobName(String(id_)) : validJobName(name),
//          active_ = bilby.isNone(active) ? true : validJobActive(active)
//      return bilby.Do()(
//         bilby.Do()(jobSetting < id_) * name_ * active_
//      )
//   }
   
//   var comment_ = (bilby.isNone(comment)) ? job[Tiem.k.comment()] : validComment(comment),
//          singleDay_ = validSingleDay(singleDay),
//          inOut_ = validInOut(inOut),
//          date_ = validDate(date)
   
//   var addCurrentJob = function(theseJobs){
//      var job = theseJobs.currentJob
//      //this.job Tubple5(id, comment, singleDay, inOut, date)
//      var list = _.reject(theseJobs.jobList, function(item){
//         return _.isEqual(item.id, job.id)
//      })
//      list.push(job)
//      theseJobs.jobList = list
//      return theseJobs
//   }
   
   var addCurrentJob = function(theseJobs){
      var job = theseJobs.current
      theseJobs.list = _.reject(theseJobs.list, function(item){
         return _.isEqual(item.jobId, job.jobId)
      }).concat(job)
      return theseJobs
   }
   
   var addJob = function(job){
      this.current = job
      return addCurrentJob(this)
   }
   
   //See https://github.com/antris/js-polymorphism/blob/master/feed/feed.js
//   var updateJobDate = function(date){
//      this.currentJob = Tiem.Clock.toggle(this.currentJob, date)
//      return addCurrentJob(this)
//   }
//   
//   var updateJobComment = function(comment){
//      this.currentJob[Tiem.k.comment()] = comment
//      return addCurrentJob(this)
//   }
   
   
   var change = _.curry(function(property, value){
      this.current[property] = value
      return addCurrentJob(this)
   })

   
   //Determine if the job is clocked in or out.
   var isClockedIn = function (job) {
       return _.has(job[Tiem.k.state()], Tiem.k.in())
   }

   //Change job state to clocked in.
   var clockIn = function (job, date) {
      job[Tiem.k.state()] = ClockedIn(date)
      return job
   }
   
   //Job is clocked in. Clock it out and update number of hours worked.
   var clockOut = function (job, date) {
       var start = Tiem.fractionalHours(job[Tiem.k.state()][Tiem.k.in()])
       var end = Tiem.fractionalHours(date)
       var newSingleDay = Tiem.addRollingArray(job[Tiem.k.singleDay()], start, end, 1)
       job[Tiem.k.state()] = ClockedOut(date)
       job[Tiem.k.singleDay()] = newSingleDay
       job[Tiem.k.total()] = Tiem.sum(newSingleDay)
       return job
   }

   var updateDate = function(date){
      //Toggle clock
      var job = this.current
      this.current = (isClockedIn(job)) ? clockOut(job, date) : clockIn(job, date)
      return addCurrentJob(this)
   }

//   var validateJob = function(id, comment, singleDay, inOut, date){
//      var id_ = validId(id),
//          //name_ = bilby.isNone(name) ? validJobName(getJobName(id_)) : validJobName(name),
//          comment_ = bilby.isNone(comment) ? '' : validComment(comment),
//          singleDay_ = bilby.isNone(singleDay) ? validSingleDay(createSingleDay()) : validSingleDay(singleDay),
//          //total = Tiem.sum(singleDay_),
//          inOut_ = bilby.isNone(inOut) ? validInOut(Tiem.k.in()) : validInOut(inOut),
//          date_ = bilby.isNone(date) ? validDate(new Date()) : validDate(date)
//      
////      return bilby.Do()(
////         bilby.Do()(jobSkeleton < id_) * comment_ * singleDay_ * (bilby.Do()(clockState < inOut_) * date_)
////      )
//      
//      //result.cata ... do on other side
//      
//   }
   
   //id, comment, singleDay, inOut, date
   //Tiem.k.jobId(), Tiem.k.jobName(), Tiem.k.comment(), Tiem.k.singleDay(), Tiem.k.total(), ClockState
   var createJob = function(jobSettings, id, comment, singleDay, inOut, date){
      var jobSetting = _.find(jobSettings.list, function(setting){
         return _.isEqual(setting[Tiem.k.jobId()], id)
      })
      if (_.isEmpty(jobSetting))
         return bilby.error('A new job must be created in the job settings first!')
      var singleDay_ = singleDay.getOrElse(_.range(24).map(function(){return 0}))
      var inOut_ = _.isEqual(inOut, Tiem.k.out()) ? ClockedOut(date) : ClockedIn(date)
      return Job(id, jobSetting[Tiem.k.jobName()], comment, singleDay_, Tiem.sum(singleDay_), inOut_)
   }

//   var addJob = function(job){
//      this.currentJob = job
//      return addCurrentJob(this)
//   }
   
//   var id = function(id){
//      var current = _.filter(this.jobList, function(id_){
//         return _.isEqual(id_, id)
//      })
//      this.currentJob = current
//      return this
//   }
   
   var getJobById = function(id){
      var current = _.filter(this.list, function(job){
         return _.isEqual(job.jobId, id)
      })
      this.current = _.first(current)
      return this
   }

//   var getSettings = function(){
//      return this.list
//   }
   
   var isObjectAnd = _.curry(function(object, func){
      var isObject = bilby.isInstanceOf(object)
      return function(){
         return isObject.apply(this) && func.apply(null, arguments)
      }
   })

   var isJobsAnd = isObjectAnd(Jobs)

   var isJobSettingsAnd = isObjectAnd(JobSettings)

   var toList = function(){return this.list}

   var toObject = function(){return this.current}
   
   var settingExtensions = bilby.environment()
      .property(
         'JobSettings',
         function(){return new JobSettings()}
      )
      .method(
         'toList',
         isJobSettingsAnd(bilby.constant(true)),
         toList
      )
      .method(
         'toObject',
         isJobSettingsAnd(bilby.constant(true)),
         toObject
      )
      .method(
         'create',
         isJobSettingsAnd(function(id, name, active){
            return Tiem.isWholeNumber(id) && _.isString(name) && _.isBoolean(active)
         }),
         JobSetting
      )
      .method(
         'add',
         isJobSettingsAnd(bilby.isInstanceOf(JobSetting)),
         addJob
      )
      .method(
         'id',
         isJobSettingsAnd(Tiem.isWholeNumber),
         getJobById
      )
      .method(
         'update',
         isJobSettingsAnd(_.isString),
         change(Tiem.k.jobName())
      )
      .method(
         'update',
         isJobSettingsAnd(_.isBoolean),
         change(Tiem.k.jobActive())
      )
   
   var isJobs = bilby.isInstanceOf(Jobs)

   var jobExtensions = bilby.environment()
      .property(
         'Jobs',
         function(){return new Jobs()}
      )
      .method(
         'toList',
         isJobs, 
         toList
      )
      .method(
         'toObject',
         isJobs,
         toObject
      )
      .method(
         'create',
         isJobsAnd(function(jobSettings, id, comment, singleDay, inOut, date){
            return Tiem.isWholeNumber(id)
               && _.isString(comment)
               && (bilby.isOption(singleDay) && singleDay.fold(function(a){return _.isArray(a) && a.length === 24}, function(){return true}))
               && (_.isEqual(inOut, Tiem.k.in()) || _.isEqual(inOut, Tiem.k.out()))
               && _.isDate(date)
               && bilby.isInstanceOf(JobSettings, jobSettings)
         }),
         createJob
      )
      .method(
         'add',
         function(job){return isJobsAnd(bilby.isInstanceOf(Job, job))},
         addJob
      )
      .method(
         'id',
         isJobsAnd(Tiem.isWholeNumber),
         getJobById
      )
      .method(
         'update',
         isJobsAnd(_.isString),
         change(Tiem.k.comment())
      )
      .method(
         'update',
         isJobsAnd(_.isDate),
         updateDate
      )
      

   var extendObject = function(object, extensions){
      _(extensions).forIn(function(value, key){
         object.prototype[key] = value 
      })
   }

   extendObject(JobSettings, settingExtensions)
   extendObject(Jobs, jobExtensions)

   return Objects(jobExtensions, settingExtensions) //settingExtensions
   
}()

// /**
//  * Determine if job ids are unique in list of objects.
//  */
// Tiem.O.areUniqueIds = Tiem.areUniqueValues(Tiem.k.jobId())
// /**
//  * Determine if job names are unique in list of objects.
//  */
// Tiem.O.areUniqueNames = Tiem.areUniqueValues(Tiem.k.jobName())
// 
// /**
//  * Validate Job ID
//  * @param {Number} id Whole number unique to Job object.
//  * @return {Number} if valid same number
//  * @throws {Error} Job ID: must be a whole number.
//  */
// Tiem.O.validateJobId = function (id) {
//    return Tiem.Constraints.conditions(['Job ID: must be a whole number', Tiem.isWholeNumber])(id)
// }
// 
// /**
//  * Validate Job Name
//  * @param {String} name Job name with length greater than zero.
//  * @return {String} if valid Job name
//  * @throws {Error} Job Name: must be string
//  * @throws {Error} Job Name: value must have a length greater zero
//  */
// Tiem.O.validateJobName = function (name) {
//    var isNotEmpty = Tiem.complement(_.isEmpty)
//    return Tiem.Constraints.conditions(
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
// Tiem.O.validateActiveJob = function (active) {
//    return Tiem.Constraints.conditions(['Job Active: value must be a boolean', _.isBoolean])(active)
// }
// /**
//  * Validate Single Day object
//  * @param {Array<Number>} singleDay Rate of each of a day worked.
//  * @return {Array<Number>} if valid array
//  * @throws {Error} Single Day: Must be array of size 24
//  * @throws {Error} Single Day: Must be all numbers
//  * @throws {Error} Single Day: Value must be between -1 and 1
//  */
// Tiem.O.validateSingleDay = function (singleDay) {
// 
//    //Validate single day.
//    var count24 = function (dayArray) {
//       return dayArray.length === 24
//    }
//    var areNumbers = _.compose(_.all, _.partialRight(_.map, _.isNumber))
//    var isBetweenAbs1 = _.partial(Tiem.isBetween, -1, 1)
//    var allBetweenAbs1 = _.compose(_.all, _.partialRight(_.map, isBetweenAbs1))
// 
//    return Tiem.Constraints.conditions(
//        ['Single Day: Must be array of size 24', count24], ['Single Day: Must be all numbers', areNumbers], ['Single Day: Value must be between -1 and 1', allBetweenAbs1])(singleDay)
// 
// }
// /**
//  * Validate date object
//  * @param {Date} date Date object
//  * @return {Date} if valid date
//  * @throws {Error} In: Must have valid date
//  */
// Tiem.O.validateDate = function (date) {
//    //Validate In
//    return Tiem.Constraints.conditions(['In: Must have valid date', _.isDate])(date)
// }
// /**
//  * Validate clock state
//  * @param {in|out} inOut in/out object
//  * @return {in|out} if valid in/out object
//  * @throws {Error} Clock State: Must be an object type In or Out
//  */
// Tiem.O.validateClockState = function (inOut) {
//    //Validate input
//    var isInOrOut = function (inOut) {
//       return _.has(inOut, Tiem.k. in ()) || _.has(inOut, Tiem.k.out())
//    }
//    return Tiem.Constraints.conditions(['Clock State: Must be an object type In or Out', isInOrOut])(inOut)
// }
// /**
//  * Validate clock information
//  * @param {Array<Object>} clockInfo Array containing objects singleDay and clock state
//  * @return {Array<Object>} if valid array object
//  * @throws {Error} Clock Info: Must be an object of Clock State and Single Day
//  */
// Tiem.O.validateClockInfo = function (clockInfo) {
//    //Validate input
//    var containsClockInfoObjects = function ( /* [singleDay, state]) */ ) {
//       var args = Tiem.toFlatArray(arguments)
//       var singleDay = _.first(args),
//          total = args[1],
//          state = _.last(args);
//       return Tiem.have([
//             [singleDay, Tiem.k.singleDay()],
//             [state, Tiem.k.state()],
//             [total, Tiem.k.total()]
//          ])
//    }
//    return Tiem.Constraints.conditions(
//         ['Clock Info: Must be an object of Clock State, Total, and Single Day', containsClockInfoObjects])(clockInfo)
// }
// /**
//  * Validate job information object
//  * @param {Array<Object>} jobInfo Array containing objects {single day, clock state}, and job
//  * @return {Array<Object>} if valid array object
//  * @throws {Error} Job Info: Must have objects Clock Info and Job
//  */
// Tiem.O.validateJobInfo = function (jobInfo) {
//    //Validate input
//    var containsJobInfo = function ( /* [{single day, clock state}, job id, job name, comment] */ ) {
//       var args = Tiem.toFlatArray(arguments)
//       var clockInfo = _.first(args),
//          jobId = args[1],
//          jobName = args[2],
//          comment = _.last(args);
//       return (Tiem.have([
//             [clockInfo, Tiem.k.singleDay()],
//             [clockInfo, Tiem.k.state()],
//             [jobId, Tiem.k.jobId()],
//             [jobName, Tiem.k.jobName()],
//             [comment, Tiem.k.comment()]
//         ]))
//    }
//    return Tiem.Constraints.conditions(
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
// Tiem.O.validateDay = function (dayArray) {
//    //Validate Jobs
// 
//    var areUniqueIdsLast = _.compose(Tiem.O.areUniqueIds, _.last)
// 
//    var containsDayArray = function ( /* [date, [jobInfo]]*/ ) {
//       var args = _.toArray(arguments)[0]
//       var date = _.first(args),
//          jobInfo = _.last(args);
//       return _.isDate(date) && _.isArray(jobInfo)
//    }
// 
//    return Tiem.Constraints.conditions(
//       ['Day: Must have unique IDs', areUniqueIdsLast], ['Day: Must have date and job list', containsDayArray]
//    )(dayArray)
// }
// 
// Tiem.Settings.createJobList = Tiem.O.validateJobList = function (jobArray) {
//    return Tiem.Constraints.conditions(
//         ['Jobs must have unique IDs', Tiem.O.areUniqueIds], ['Jobs must have unique names', Tiem.O.areUniqueNames]
//    )(jobArray)
// }
// 
// /**
//  * Tiem.O objects
//  * @example Tiem.O.createJobId(0) -> {jobId: 0}
//  * @param {Number} Whole number representing job object ID.
//  * @return {Object} Object of type {jobId: 0}
//  * @throws {Error} Job ID: must be a whole number
//  */
// Tiem.Settings.createJobId = Tiem.O.createJobId = function (id) {
//    Tiem.O.validateJobId(id)
// 
//    return _.zipObject(
//   [Tiem.k.jobId()], [id]
//    )
// }
// 
// /**
//  * Create a name for job.
//  * @example Tiem.O.createJobName(' a job name  ') => {jobName: 'a job name'}
//  * @param {String} name The job name for current instance. Must be string with less than 50 characters.
//  * @returns {Object} {jobName: <String>}
//  */
// Tiem.O.createJobName = Tiem.Settings.createJobName = function (name) {
//    var name_ = String(name.trim())
//    Tiem.O.validateJobName(name_)
//    return _.zipObject(
//   [Tiem.k.jobName()], [name_]
//    )
// }
// 
// /**
//  * Create a comment.
//  * @example Tiem.O.createComment(' a comment, yay!  ') => {comment: 'a comment, yay!'}
//  * @param {String} comment The job comment for current instance. Must be a string.
//  * @returns {Object} {comment: <String>}
//  */
// Tiem.O.createComment = function (comment) {
//    var comment_ = _.isEmpty(comment) ? '' : String(comment.trim())
//    return _.zipObject(
//   [Tiem.k.comment()], [comment_]
//    )
// }
// 
// /**
//  * Object which represents a single day's time.
//  * @example Tiem.O.createSingleDay([0..23]) -> {singleDay: [0..23]}
//  * @param {Array<Number>} dayArray Array of length 24 with values between -1 and 1 inclusive, a zero length array is acceptable
//  * @return {Object} {singleDay: [0..23]}
//  * @throws {Error} Single Day: Must be array of size 24
//  * @throws {Error} Single Day: Must be all numbers
//  * @throws {Error} Single Day: Value must be between -1 and 1
//  */
// Tiem.O.createSingleDay = function (dayArray) {
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
//    Tiem.O.validateSingleDay(dayArray_)
// 
//    return _.zipObject(
//     [Tiem.k.singleDay()], [dayArray_]
//    )
// 
// }
// 
// /**
//  * Creates an object wrapped around the total.
//  * @example Tiem.O.createTotal({singleDay: [0..23].map(1)}) => {total: 24}
//  * @param {Object<singleDay>} singleDay Object single day.
//  * @returns {Object<total>} Total object with number total.
//  */
// Tiem.O.createTotal = function (singleDay) {
//    return _.zipObject(
//         [Tiem.k.total()], [Tiem.sum(singleDay[Tiem.k.singleDay()])])
// }
// 
// /*
//  * Object representing the clocked in state.
//  * @example Tiem.O.createIn(new Date()) -> {in: <date value>}
//  * @param {Date} date Date/Time when clocked in
//  * @return {Object} {in: <date value>}
//  * @throws {Error} In: Must have valid date
//  */
// Tiem.O.createIn = function (date) {
//    'use strict';
// 
//    //Determine the validity of the argument.
//    Tiem.O.validateDate(date)
// 
//    return _.zipObject(
//     [Tiem.k. in ()], [date]
//    )
// }
// /*
//  * Object representing clocked out state.
//  * @example Tiem.O.createOut() -> {out: ''}
//  * @return {Object} {out: ''}
//  */
// Tiem.O.createOut = function () {
//    'use strict';
// 
//    return _.zipObject(
//     [Tiem.k.out()], ['']
//    )
// 
// }
// /*
//  * Object which represents the toggle state of the job.
//  * @example Tiem.O.createClockState({in:date}|{out:''}) -> {clockState: {<in|out>}}
//  * @param {Object<in>|Object<out>} inOut In or out object.
//  * @return {Object<in>|Object<out>} {clockState: {<in|out>}}
//  * @throws {Error} In: Must have valid date
//  */
// Tiem.O.createClockState = function (inOut) {
//    "use strict";
// 
//    Tiem.O.validateClockState(inOut)
// 
//    return _.zipObject(
//     [Tiem.k.state()], [inOut]
//    )
// 
// }
// /*
//  * Contains objects ClockState and SingleDay.
//  * @example Tiem.O.createClockInfo({singleDay: [0..23]}, {clockState:{in|out:<value>}})
//  * @param {Object<singleDay>} singleDay Object singleDay with array value representing hours over 24 hour period.
//  * @param {Object<total>} total Object total containing the sum of single day object.
//  * @param {Object<in>|Object<out>} inOut In or out object.
//  * @return {Object} {singleDay: [0..23], total: <Number>, clockState: {<in|out>}}
//  * @throws {Error} Clock Info: Must be an object of Clock State and Single Day
//  */
// Tiem.O.createClockInfo = function (singleDay, total, state) {
//    "use strict";
// 
//    Tiem.O.validateClockInfo([singleDay, total, state])
// 
//    return _.assign(singleDay, total, state)
// 
// }
// /*
//  * Contains objects ClockInfo and Job
//  * @example Tiem.O.createJobInfo({singleDay:<[0..23]>, in|out:<value>}, {jobId:<wholeNumber>}) -> {jobID:<wholeNumer>, singleDay:<[0..23]>, in|out:<value>}
//  * @param {Object} clockInfo Object containing singleDay and in|out objects.
//  * @param {Object<jobId>} jobId Object containing the unique job ID.
//  * @param {Object<jobName>} jobName Object containing the unique job name.
//  * @param {Object<comment>} comment Object containing comment.
//  * @return {Object} {jobId: <value>, singleDay: [0..23], clockState: {<in|out>}}
//  * @throws {Error} Job Info: Must have objects Clock Info and Job
//  */
// Tiem.O.createJobInfo = function (clockInfo, jobId, jobName, comment) {
//    "use strict";
// 
//    Tiem.O.validateJobInfo([clockInfo, jobId, jobName, comment])
// 
//    return _.assign(jobId, jobName, comment, clockInfo)
// 
// }
// /*
//  * Contains a list of JobInfo objects.
//  * @example Tiem.O.createJobs([jobInfo]) -> {jobID:<wholeNumber>, singleDay:<[0..23]>, in|out:<value>}
//  * @param {Date} date The date of the list of Job information objects.
//  * @param {Array<jobInfo>} jobInfos Array containing jobInfos.
//  * @return {Object} {date: <value>, [jobInfo{}]}
//  * @throws {Error} Day: Must have date and job list
//  * @throws {Error} Day: Must have unique IDs
//  */
// Tiem.O.createDay = function (date, jobInfos) {
//    "use strict";
// 
//    Tiem.O.validateDay([date, jobInfos])
// 
//    return _.zipObject([Tiem.k.day(), Tiem.k.jobList()], [date, jobInfos])
// }
// 
// /**
//  * Create the object 'clock state' which is clocked in.
//  * @example createClockedInState(new Date()) -> {clockState: {in: <Date>}}
//  * @param {Date} time The time when the person clocks in.
//  * @return {Object<clockState>} {clockState: {in: <Date>}}
//  */
// Tiem.O.inState = _.compose(Tiem.O.createClockState, Tiem.O.createIn)
// 
// /**
//  * The object 'clock state' which is clocked out.
//  * @example clockedOutState -> {clockState: {out: ''}}
//  */
// Tiem.O.outState = _.compose(Tiem.O.createClockState, Tiem.O.createOut)
// 
// /**
//  * The object 'clock information' which is clocked out.
//  * @example Tiem.O.defaultClockInfo() -> {singleDay: [0..23].map(0), 0, clockState: {out: ''}}
//  */
// Tiem.O.defaultClockInfo = function () {
//    var singleDay = Tiem.O.createSingleDay('')
//    return Tiem.O.createClockInfo(singleDay, Tiem.O.createTotal(singleDay), Tiem.O.outState())
// }
// 
// /*
//  * Converts the JobInfo object to a view compatible object.
//  * @example Tiem.O.defaultJobInfo() => {jobID: 0, jobName: 'jobName', comment: '', singleDay: [0..23].map(0), total: 0, clockState: {out: ''}}
//  * @returns Default object containing job information. {jobID: 0, jobName: 'jobName', comment: '', singleDay: [0..23].map(0), total: 0, clockState: {out: ''}}
//  */
// Tiem.O.defaultJobInfo = function () {
// 
//    var clockInfo = Tiem.O.defaultClockInfo()
//    return Tiem.O.createJobInfo(
//       clockInfo,
//       Tiem.O.createJobId(0),
//       Tiem.O.createJobName(Tiem.k.jobName()),
//       Tiem.O.createComment(''))
// 
// }
// 
// /*****************************
//  * Settings
//  *****************************/
// 
// Tiem.Settings.createJobActive = function (active) {
//    Tiem.O.validateActiveJob(active)
//    return _.zipObject(
//         [Tiem.k.jobActive()], [active])
// }
// 
// Tiem.Settings.jobs = function () {
//    // Need to get this data from where it is stored.
// 
//    return [_.assign(Tiem.Settings.createJobActive(true), Tiem.Settings.createJobId(0), Tiem.Settings.createJobName('Job1')),
//       _.assign(Tiem.Settings.createJobActive(true), Tiem.Settings.createJobId(1), Tiem.Settings.createJobName('Job2')),
//       _.assign(Tiem.Settings.createJobActive(false), Tiem.Settings.createJobId(2), Tiem.Settings.createJobName('Not a Job'))
//       ]
// }
