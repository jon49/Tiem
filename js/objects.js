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

var addNew = _.compose(addJob, JobSetting)

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

var isCreateJobSetting = function(id, name, active){
   return isWholeNumber(id) && _.isString(name) && _.isBoolean(active)
}

var isCreateJob = function(jobSettings, id, comment, singleDay, inOut, date){
   return isWholeNumber(id)
      && _.isString(comment)
      && (b.isOption(singleDay) && singleDay.fold(function(a){return _.isArray(a) && a.length === 24}, function(){return true}))
      && (_.isEqual(inOut, k.in()) || _.isEqual(inOut, k.out()))
      && _.isDate(date)
      && b.isInstanceOf(JobSettings, jobSettings)
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
         addNew
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
