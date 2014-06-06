/**
 * Contains functions for view.
 */

/* jslint asi: true */
/*jshint indent:3, curly:false, laxbreak:true */
/* global t, document, $, _, k, m, b */

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
                   ['jobPlaceHolder', 'Add Job'],
                   ['stampsIn', 'stamps-in'],
                   ['stampsOut', 'stamps-out']
])

t = t.property('k', k)

var jobSettingKeys = [k.id(), k.name(), k.jobActive()]
var clockInKeys = [k.in()]
var clockOutKeys = [k.out()]
var jobKeys = [k.id(), k.name(), k.comment(), k.singleDay(), k.total(), k.state()]

var l = lenses(_.union(jobSettingKeys, clockInKeys, clockOutKeys, jobKeys))

t = t.property('l', l)

// **Validate objects**

var Jobs = function(){
   this.list = []
   this.target = b.none
}
var JobSettings = function(){
   this.list = []
   this.target = b.none
}

// #Object Definitions
// {jobID: 0, name: 'name', jobActive: true|false}
var JobSetting = b.tagged('JobSetting', jobSettingKeys)
//var jobSetting = _.curry(JobSetting)
// {jobID: 0, name: 'name', comment: '', singleDay: [0..23].map(0), total: 0, clockState: {out|in: ''}}
var ClockedIn = b.tagged('ClockedIn', clockInKeys)
var ClockedOut = b.tagged('ClockedOut', clockOutKeys)
//var JobSkeleton = b.tagged('JobSkeleton', [k.id(), k.comment(), k.singleDay(), k.state()])
//var jobSkeleton = _.curry(JobSkeleton)
var Job = b.tagged('Job', jobKeys)
//var job = _.curry(Job)

// Validation
//var validId = function (id) {
//      return t.isWholeNumber(id) ? b.success(id) : b.failure(['ID must be a whole number'])
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
//   var isBetweenAbs1 = _.partial(t.isBetween, -1, 1)
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

// use id to get job from list
var getJobById = _.partial(getTargetBy, l.id)

// use id to get exclusively add updated job
var xAddTargetJob = _.partial(xAddToList, l.id)

// put a new job in target the exclusively update it
var addJob = _.compose(xAddTargetJob, toTarget)

// determine if the job id is valid
var validJobId = function(list, id){
   var id_ = parseInt(id)
   return   isNaN(id_)                                ? b.failure(['ID is not a number'])
            : !_.any(list, b.singleton(k.id(), id_))  ? b.failure(['No ID number exists'])
            : b.success(id_)
}

// determine if the new job name is valid
var validJobName = function(list, name){
   var name_ = name.trim()
   return _.isEmpty(name_)          ? b.failure(['Job name must contain characters'])
          : _.any(list, function(j){
             return _.isEqual(name_.toLowerCase(), j.name.toLowerCase())
          })                        ? b.failure(['Job name already exists'])
          : b.success(name_)
}

// validate a single item
var validateSingle = function(type, validation, success, failure){
   var 
      type_ = b.curry(b.tagged(type.replace(/^(.){1}/,'$1'.toUpperCase()), [type])),
      result = b.Do()(b.Do()(validation < type_))
   result.cata({
      success: success,
      failure: failure
   })
}

// validate the job name
var validJobName_ = function(name){
   var that = this, v
   validateSingle(k.name(),
                  validJobName(that.list, name), 
                  function(value){
                     that.target = b.none
                     v = b.success(value.name)
                  },
                  function(errors){
                     that.target = b.none
                     v = b.failure(errors)
                  })
   return b.Do()(v)
}

// validate the job selection (id or name)
var validJobSelection = function(object){
   var that = this, v
   validateSingle(k.id(),
                  validJobId(that.list, object), 
                  function(value){
                     getJobById.apply(that, [value.id])
                     v = b.success(that.target.getOrElse(''))
                  },
                  function(errors){
                     that.target = b.none 
                     v = b.failure(errors)
                  })
   return b.Do()(v)
}

// set property of target to new value
var change = _.curry(function(property, value){
   return xAddTargetJob(overTarget(l[property], b.constant(value), this))
})
   
//Determine if the job is clocked in or out.
var isClockedIn = hasDeep('in') 

//Job is clocked in. Clock it out and update number of hours worked.
var clockOut = function (job, date) {
    var start = fractionalHours(get(l[k.in()].compose(l[k.state()]), job))
    var end = fractionalHours(date)
    var newSingleDay = addRollingArray(get(l[k.singleDay()], job), start, end, 1)
    return _.reduce([[k.state(), ClockedOut(date)], [k.singleDay(), newSingleDay], [k.total(), sum(newSingleDay)]], 
                    function(acc, value){
                        return set(l[_.first(value)], acc, _.last(value))
                    }, job)
}

// Toggle the clock on target.
var updateDate = function(date){
   //Toggle clock
   return xAddTargetJob(
      this.target.map(function(job){
         return   isClockedIn(job)
                  ? clockOut(job, date)
                  : set(l[k.state()], job, date) // clock in
      }).getOrElse(this))
}

// validate inputs
var isCreateJobSetting = function(id, name, active){
   return isWholeNumber(id) && _.isString(name) && _.isBoolean(active)
}

// validate inputs
var isCreateJob = function(jobSettings, id, comment, singleDay, inOut, date){
   return isWholeNumber(id)
      && _.isString(comment)
      && (b.isOption(singleDay) && singleDay.fold(function(a){return _.isArray(a) && a.length === 24}, function(){return true}))
      && (_.isEqual(inOut, k.in()) || _.isEqual(inOut, k.out()))
      && _.isDate(date)
      && b.isInstanceOf(JobSettings, jobSettings)
}

//Start here!
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

var toArray = function(){return this.list} // _.cloneDeep(this.list)}

var toObject = function(){return this.target} // _.cloneDeep(this.target)}

t = 
   t.property(
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
         isCreateJobSetting,
         JobSetting
      )
      .method(
         'add',
         b.isInstanceOf(JobSetting),
         addJob
      )
      .method(
         'addNew',
         isCreateJobSetting,
         _.compose(addJob, JobSetting)
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
            this.target = _.first(_.filter(this.list, function(setting){
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
   
t = 
   t.property(
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
         isCreateJob,
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
      .method(
         'addNew',
         isCreateJob,
         _.compose(addJob, createJob)
      )
)
      

var extendObject = function(object, extensions){
      _(extensions).forIn(function(value, key){
         object.prototype[key] = value 
      })
}

extendObject(JobSettings, t.JobSettings)
extendObject(Jobs, t.Jobs)
